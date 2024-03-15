// ./http/auth/controller.ts
import { randomBytes } from 'crypto'
import { ethers } from 'ethers'
import fs from 'fs/promises'
import path from 'path'
import { handleController } from '../../utils'
import {
  getUserById,
  loginUser,
  loginUserChat,
  loginUserWithWallet,
  logoutUser,
  registerUser,
  resendOtp,
  resetPasswordQuery,
  sendEmailVerificationToken,
  updateUserQuery,
  verifyEmailTokenQuery,
  verifyLoginOTP,
  verifyPasswordResetQuery,
} from './queries'

const rootPath = process.cwd()
const BASE_UPLOAD_DIR = path.join(rootPath, 'public', 'uploads')

export const controllers = {
  register: handleController(async (_, __, ___, query, body) => {
    const { first_name, last_name, email, password, ref } = body
    return await registerUser(first_name, last_name, email, password, ref)
  }),
  login: handleController(async (_, __, ___, ____, body) => {
    return await loginUser(body.email, body.password)
  }),
  loginChat: handleController(async (_, __, ___, query) => {
    const { first_name, last_name, email, password } = query
    return await loginUserChat(email, password, first_name, last_name)
  }),
  loginOtp: handleController(async (_, __, ___, ____, body) => {
    return await verifyLoginOTP(body.uuid, body.otp)
  }),
  resendOtp: handleController(async (_, __, ___, ____, body) => {
    return await resendOtp(body.uuid, body.secret)
  }),
  profile: handleController(async (_, __, ___, ____, _____, user) => {
    if (!user) throw new Error('User not found')
    return await getUserById(user.id)
  }),
  update: handleController(async (_, __, ___, ____, body, user) => {
    if (!user) throw new Error('User not found')
    const {
      first_name,
      last_name,
      email,
      metadata,
      avatar,
      current_password,
      new_password,
    } = body
    return await updateUserQuery(
      user.id,
      first_name,
      last_name,
      email,
      metadata,
      avatar,
      current_password,
      new_password,
    )
  }),
  resetPassword: handleController(async (_, __, ___, ____, body) => {
    return await resetPasswordQuery(body.email)
  }),
  verifyResetPassword: handleController(async (_, __, ___, ____, body) => {
    return await verifyPasswordResetQuery(body.token)
  }),
  sendEmailVerification: handleController(
    async (_, __, ___, ____, body, user) => {
      if (!user) throw new Error('User not found')
      const { email } = body
      return await sendEmailVerificationToken(user.id, email)
    },
  ),
  verifyEmail: handleController(async (_, __, ___, ____, body) => {
    return await verifyEmailTokenQuery(body.token)
  }),
  logout: handleController(async (_, req, ___, ____, _____, user) => {
    if (!user) throw new Error('User not found')
    return await logoutUser(req, user.id)
  }),
  loginWithWallet: handleController(async (_, __, ___, ____, body) => {
    const { walletAddress } = body
    return await loginUserWithWallet(walletAddress)
  }),
  generateNonce: handleController(async (_, __, ___, ____, _____) => {
    // Implement your logic to generate a nonce
    const nonce = randomBytes(16).toString('hex')
    return { nonce }
  }),
  verifyMessage: handleController(async (_, __, ___, ____, body) => {
    const { message, signature, walletAddress } = body
    const isVerified = await verifySignature(message, signature, walletAddress)

    if (!isVerified) throw new Error('Signature verification failed')

    return await loginUserWithWallet(walletAddress)
  }),

  upload: handleController(async (_, __, ___, ____, body, user) => {
    if (!user) throw new Error('User not found')
    try {
      const { dir, files, oldImagePath } = body
      if (!dir || !files || files.length === 0) {
        throw new Error('No directory specified or no files provided')
      }

      const mediaDir = path.join(BASE_UPLOAD_DIR, dir)
      await ensureDirExists(mediaDir)

      const uploadedFiles = []

      for (const file of files) {
        const mimeType = file.type
        if (
          ![
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/webm',
            'video/avi',
            'video/ogg',
          ].includes(mimeType)
        ) {
          throw new Error('Unsupported file format')
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const extension = path.extname(file.name)
        const filename = `${uniqueSuffix}${extension}`
        const filePath = path.join(mediaDir, filename)

        await fs.writeFile(filePath, Buffer.from(file.data))
        uploadedFiles.push({ ...file, filename })
      }

      try {
        await moveFilesToTypeDirectory(uploadedFiles, dir)
      } catch (error) {
        console.error('Error moving files:', error)
        throw error
      }

      if (oldImagePath) {
        try {
          await removeOldImageIfAvatar(oldImagePath)
        } catch (error) {
          console.error('Error removing old image:', error)
        }
      }

      const imagePaths = uploadedFiles.map(
        (file) => `/uploads/${dir}/${file.filename}`,
      )

      return imagePaths
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }),
}

export const verifySignature = async (
  message: string,
  signature: string,
  expectedAddress: string,
) => {
  try {
    // In v6, we use the Signature class for signature operations
    const sig = ethers.Signature.from(signature)
    const messageHash = ethers.hashMessage(message)
    const recoveredAddress = ethers.recoverAddress(messageHash, sig)

    return recoveredAddress === expectedAddress
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

async function ensureDirExists(dir) {
  try {
    await fs.access(dir)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dir, { recursive: true })
    } else {
      throw error // If the error is not ENOENT, rethrow it.
    }
  }
}

async function moveFilesToTypeDirectory(files, type) {
  const typeDirectory = path.join(BASE_UPLOAD_DIR, type)
  await ensureDirExists(typeDirectory) // Ensure the directory exists

  for (const file of files) {
    const sourcePath = path.join(BASE_UPLOAD_DIR, file.filename)
    const destPath = path.join(typeDirectory, file.filename)

    try {
      await fs.rename(sourcePath, destPath)
    } catch (error) {
      console.error('Error moving file:', error)
      // Handle error appropriately
    }
  }
}

async function removeOldImageIfAvatar(oldImagePath) {
  if (oldImagePath) {
    const oldImageFullPath = path.join(rootPath, 'public', oldImagePath)
    try {
      await fs.access(oldImageFullPath)
      await fs.unlink(oldImageFullPath)
    } catch (error) {
      console.error('Error removing old image:', error)
    }
  }
}
