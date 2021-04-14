import Editor from "../../editor";
import $ from '../../utils/dom-core'
import { getRandom } from "../../utils/util";
import { PanelConf, PanelTabConf } from "../menu-constructors/Panel";

export default function (editor: Editor) {
    const inputId = getRandom('input')
    const btnOkId = getRandom('btnOkId')

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

    const conf: PanelConf = {
        width: 300,
        height: 0,
        tabs: []
    }

    const tabsConf: PanelTabConf[] = [
        {
            title: "上传视频",
            tpl: `<div>
                    <div>
                        <input id="${inputId}"
                            type="text"
                            class="block"
                            placeholder="请输入视频地址"
                            >
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
                    fn: () => {
                        const $input = $('#' + inputId)
                        console.log($input)
                        const video = $input.val().trim()

                        // 视频为空 不插入
                        if (!video) return

                        // 对当前用户插入的内容进行判断，插入为空，或者返回false，都停止插入
                        if (!checkOnlineVideo(video)) return

                        insertVideo(video)

                        // return true panel关闭
                        return true
                    }
                }
            ]
        }
    ]

    conf.tabs.push(tabsConf[0])

    return conf
}