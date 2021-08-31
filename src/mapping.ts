import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer } from '../generated/PollyToken/PollyToken'
import { Burn } from '../generated/schema'

const genesisAddress = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export function handleTransfer(event: Transfer): void {
  if (event.params.to == genesisAddress) {
    log.info('{} burned {} Polly', [
      event.params.from.toHex(),
      event.params.value.toString()
    ])
    let entity = Burn.load('0')

    if (entity == null) {
      entity = new Burn('0')
      entity.burnedTokens = BigInt.fromI32(0)
      entity.eventCount = BigInt.fromI32(0)
    }

    entity.burnedTokens = entity.burnedTokens.plus(event.params.value)
    entity.eventCount = entity.eventCount.plus(BigInt.fromI32(1))

    entity.save()
  }
}
