import Editor from '../../editor'
import $ from '../../utils/dom-core'
import { getRandom } from '../../utils/util'
import { PanelConf, PanelTabConf } from '../menu-constructors/Panel'
import UploadVideo from './upload-video'

export default function (editor: Editor) {
    const uploadVideo = new UploadVideo(editor)
    const config = editor.config
    const inputId = getRandom('input')
    const btnOkId = getRandom('btnOkId')
    const btnStartId = getRandom('btn-local-ok')
    const inputUploadId = getRandom('input-upload')
    /**
     * 插入链接
     * @param iframe html标签
     */
    function insertVideo(video: string): void {
        editor.cmd.insertEmbed('video2', video)

        // video添加后的回调
        editor.config.onlineVideoCallback(video)
    }

    /**
     * 校验在线视频链接
     * @param video 在线视频链接
     */
    function checkOnlineVideo(video: string): boolean {
        // 查看开发者自定义配置的返回值
        const check = editor.config.onlineVideoCheck(video)
        if (check === true) {
            return true
        }
        if (typeof check === 'string') {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            editor.config.customAlert(check, 'error')
        }
        return false
    }

    /**
     * 触发本地资源选择框
     */
    const emitUploadFn = () => {
        const $file = $('#' + inputUploadId)
        const fileElem = $file.elems[0]
        if (fileElem) {
            fileElem.click()
        } else {
            // 返回 true 可关闭 panel
            return true
        }
    }

    /**
     * 本地视频上传完成后插入将视频插入到编辑器中
     */
    const insertVideoFn = () => {
        const $file = $('#' + inputUploadId)
        const fileElem = $file.elems[0]
        if (!fileElem) {
            // 返回 true 可关闭 panel
            return true
        }

        // 获取选中的 file 对象列表
        const fileList = (fileElem as any).files
        if (fileList.length) {
            uploadVideo.uploadVideo(fileList)
        }

        // 返回 true 可关闭 panel
        return true
    }

    const insertVideoByInput = () => {
        const $input = $('#' + inputId)
        const value = $input.val().trim()
        const video = `<iframe src="${value}" style="width:100%;height:100%;"></iframe>`

        // 视频为空 不插入
        if (!video) return

        // 对当前用户插入的内容进行判断，插入为空，或者返回false，都停止插入
        if (!checkOnlineVideo(video)) return

        insertVideo(video)

        // return true panel关闭
        return true
    }

    const tabsConf: PanelTabConf[] = [
        {
            // tab 的标题
            title: editor.i18next.t('menus.panelMenus.video.上传视频'),
            tpl: `<div class="w-e-up-video-container">
                    <div id="${btnStartId}" class="w-e-up-btn">
                        <i class="w-e-icon-upload2"></i>
                    </div>
                    <div style="display:none;">
                        <input id="${inputUploadId}" type="file" accept="video/*"/>
                    </div>
                 </div>`,
            events: [
                // 触发选择视频
                {
                    selector: '#' + btnStartId,
                    type: 'click',
                    fn: emitUploadFn,
                },
                // 选择视频完毕
                {
                    selector: '#' + inputUploadId,
                    type: 'change',
                    fn: insertVideoFn,
                },
            ],
        },
        {
            // 插入视频
            title: editor.i18next.t('menus.panelMenus.video.插入视频'),
            tpl: `<div>
                    <div>
                        <input id="${inputId}"
                            type="text"
                            class="block"
                            placeholder="${editor.i18next.t(
                                '如'
                            )}：https://player.bilibili.com..."/>
                    </div>
                    <div class="w-e-button-container">
                        <button type="button" id="${btnOkId}">
                            ${editor.i18next.t('插入')}
                        </button>
                    </div>
                </div>
            `,
            events: [
                {
                    selector: '#' + btnOkId,
                    type: 'click',
                    fn: insertVideoByInput,
                },
            ],
        },
    ]

    const conf: PanelConf = {
        width: 300,
        height: 0,
        tabs: [],
    }

    // 显示“上传视频”
    if (window.FileReader && (config.uploadVideoServer || config.customUploadVideo)) {
        conf.tabs.push(tabsConf[0])
    }
    // 显示“插入视频”
    if (config.showLinkVideo) {
        conf.tabs.push(tabsConf[1])
    }

    return conf
}
