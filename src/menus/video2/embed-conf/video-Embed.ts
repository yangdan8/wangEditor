import { IEmbed } from "../../../embed/IEmbed";
import { EMBED_KEY } from "./const";
import $, { DomElement } from '../../../utils/dom-core'
import { IEmbedConstruct } from "../../../embed/IEmbedConstruct";

export default class VideoEmbed extends IEmbedConstruct implements IEmbed {
    embedKey = EMBED_KEY
    isBlock = true
    data: any
    $content = $('')
    private videoInstance: any = null

    constructor() {
        super(EMBED_KEY)
    }

    public get $container(): DomElement {
        return $(`#${this.id}`)
    }

    public render(): void {
        const video = $(`<video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls="controls" style="max-width:100%"></video>`)
        this.$content.append(video)
        const videoInstance = video
        this.videoInstance = videoInstance
    }
    /**
    * 获取 result html ，执行 txt.html() 时触发
     * @returns html 代码
     */
    public genResultHtml(): string {
        const videoInstance = this.videoInstance
        return videoInstance // 语言，写死为 js
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