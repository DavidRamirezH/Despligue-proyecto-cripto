export default function useUserStakingActions() {
  const apiPath = useRuntimeConfig().public.apiPath

  const stakeTokens = async (
    pool_id: string,
    amount: number,
    duration_id: string,
  ) => {
    const response = await $fetch(`${apiPath}/api/staking/stake`, {
      method: 'POST',
      body: {
        pool_id,
        amount,
        duration_id,
      },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const withdrawStake = async (stakeId) => {
    const response = await $fetch(`${apiPath}/api/staking/withdraw`, {
      method: 'POST',
      body: { stake_id: stakeId },
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  const listMyStakes = async () => {
    const response = await $fetch(`${apiPath}/api/staking/my-stakes`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.status) {
      throw response
    }

    return response
  }

  return {
    stakeTokens,
    withdrawStake,
    listMyStakes,
  }
}
