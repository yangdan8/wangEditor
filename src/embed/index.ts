/**
 * @description embed index
 * @author wangfupeng
 */

import Editor from '../editor/index'
import { IEmbedConf, IEmbed } from './IEmbed'
import { bindEvent } from './container'

class EmbedHandler {
    private editor: Editor
    private embedConfList: IEmbedConf[] = []
    private embedInstanceList: IEmbed[] = []

    constructor(editor: Editor) {
        this.editor = editor

        // 绑定事件
        bindEvent()
    }

    /**
     * 判断这个 conf 中 key 是否重复了
     * @param newConf embed conf
     */
    private isDuplicateKey(newConf: IEmbedConf): boolean {
        const embedConfList = this.embedConfList
        if (embedConfList.length === 0) return false
        return embedConfList.some(conf => {
            return conf.key === newConf.key
        })
    }

    /**
     * 注册 embed
     * @param conf embed conf
     */
    public registerEmbed(conf: IEmbedConf): void {
        if (this.isDuplicateKey(conf)) {
            // key 不允许重复
            throw new Error('This embed conf key is duplicated')
        }

        this.embedConfList.push(conf)
    }

    /**
     * 获取 embed conf list
     */
    public getEmbedConfList(): IEmbedConf[] {
        return this.embedConfList
    }

    /**
     * 获取 embed conf
     * @param key embed conf key
     */
    public getEmbedConf(key: string): IEmbedConf | null {
        const embedConfList = this.embedConfList
        if (embedConfList.length === 0) return null

        const filterArr = embedConfList.filter(conf => conf.key === key)
        if (filterArr.length === 0) return null
        return filterArr[0]
    }

    /**
     * 生成 embed 实例
     * @param key embed conf key
     * @param data embed data
     */
    public createEmbedInstance(key: string, data: any): IEmbed | null {
        const conf = this.getEmbedConf(key)
        if (conf == null) return null

        const instance = conf.createEmbedInstance(data)
        this.embedInstanceList.push(instance) // 记录下来，后面会用到
        return instance
    }

    /**
     * 获取 embed 实例
     * @param id embed instance id
     */
    public getEmbedInstance(id: string): IEmbed | null {
        const filterArr = this.embedInstanceList.filter(instance => instance.id === id)
        if (filterArr.length === 0) return null
        return filterArr[0]
    }
}

export default EmbedHandler
