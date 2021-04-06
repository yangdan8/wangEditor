import Editor from "../../editor";
import $ from '../../utils/dom-core'
import { getRandom } from "../../utils/util";
import { PanelConf, PanelTabConf } from "../menu-constructors/Panel";

export default function (editor: Editor) {
    const inputId = getRandom('input')
    const btnOkId = getRandom('btnOkId')

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
                            placeholder="请输入视频地址"
                            >
                    </div>
                    <div>
                        <button type="button" id="${btnOkId}">insert</button>
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
                        const value = $input.val()
                        editor.cmd.insertEmbed('video2', value)

                        return true
                    }
                }
            ]
        }
    ]

    conf.tabs.push(tabsConf[0])

    return conf
}