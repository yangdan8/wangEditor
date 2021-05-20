import { IEmbed } from '../../../embed/IEmbed'
import { EMBED_KEY } from './const'
import $, { DomElement } from '../../../utils/dom-core'
import { IEmbedConstruct } from '../../../embed/IEmbedConstruct'

export default class VideoEmbed extends IEmbedConstruct implements IEmbed {
    embedKey = EMBED_KEY
    isBlock = true
    data: any
    $content = $('')
    private videoInstance: any = null

    constructor(data: string) {
        super(EMBED_KEY)
        this.data = data
    }

    public get $container(): DomElement {
        return $(`#${this.id}`)
    }

    /**
     * embed的渲染函数，控制视频的插入
     */
    public render(): void {
        const video = $(`${this.data}`)
        const $content = this.$content
        $content.append(video)
        $content.css('height', '500px')
        const videoInstance = video
        this.videoInstance = videoInstance
    }

    /**
     * 获取 result html ，执行 txt.html() 时触发
     * @returns html 代码
     */
    public genResultHtml(): string {
        const $videoInstance: DomElement = this.videoInstance
        const url = $videoInstance.attr('data-url') || $videoInstance.attr('src')
        const tag = $videoInstance.getNodeName().toLowerCase()
        if (tag === 'video') {
            return `<${tag} src="${url}" controls="controls" style="width:100%;height:500px;"></${tag}>`
        }

        return `<${tag} src="${url}" style="width:100%;height:500px;"></${tag}>`
    }

    public onClick(event: MouseEvent): void {
        alert(`可以弹出修改 data 的输入框 ${this.id}`)
    }
    public onMouseEnter(event: MouseEvent): void {
        console.log('embed mouse enter')
    }
    public onMouseLeave(event: MouseEvent): void {
        console.log('embed mouse leave')
    }
}
