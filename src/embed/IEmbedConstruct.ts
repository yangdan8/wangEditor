import { getRandom } from "../utils/util"

export class IEmbedConstruct {
    id: string
    constructor(embed_key: any) {
        this.id = getRandom(`${embed_key}-`)
    }
}
