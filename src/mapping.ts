import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer } from '../generated/PollyToken/PollyToken'
import { Burn, TokenStats } from '../generated/schema'

const genesisAddress = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export function handleTransfer(event: Transfer): void {
  const value = event.params.value
  const from = event.params.from
  const to = event.params.to

  let tokenStats = TokenStats.load('0')
  if (tokenStats == null) {
    tokenStats = new TokenStats('0')
    tokenStats.supply = BigInt.fromI32(0)
    tokenStats.save()
  }

  if (from == genesisAddress) {
    tokenStats.supply = tokenStats.supply.plus(value)
    tokenStats.save()
  }

  if (to == genesisAddress) {
    log.info('{} burned {} Polly', [
      from.toHex(),
      value.toString()
    ])
    tokenStats.supply = tokenStats.supply.minus(value)
    let burnStats = Burn.load('0')

    if (burnStats == null) {
      burnStats = new Burn('0')
      burnStats.burnedTokens = BigInt.fromI32(0)
      burnStats.eventCount = BigInt.fromI32(0)
    }

    burnStats.burnedTokens = burnStats.burnedTokens.plus(value)
    burnStats.eventCount = burnStats.eventCount.plus(BigInt.fromI32(1))

    burnStats.save()
    tokenStats.save()
  }
}
