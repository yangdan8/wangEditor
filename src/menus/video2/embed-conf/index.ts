import { IEmbed, IEmbedConf } from '../../../embed/IEmbed'
import videoEmbed from './video-Embed'
import { EMBED_KEY } from './const'
import { DomElement } from '../../../utils/dom-core'

/**
 * 判读 elem 是否符合 formula的 result html 
 * resultHtml -> <video src="xxxxx"></video>
 * @param $video video节点
 * @returns 
 */
function isEmbedElem($video: DomElement): boolean {

    const nodeName = $video.getNodeName().toLowerCase()
    if (nodeName !== 'video') return false

    return true
}

/**
 * 创建 embed 实例 
 * @returns embed instance
 */
function createEmbedInstance(data: any): IEmbed {
    return new videoEmbed(data)
}

function getDataFromElem() {
    return '123'
}

/**
 * 创建 embed conf
 * @returns embed conf
 */
function createEmbedConf(): IEmbedConf {
    return {
        key: EMBED_KEY,
        isEmbedElem,
        getDataFromElem,
        createEmbedInstance,
    }
}

export default createEmbedConf