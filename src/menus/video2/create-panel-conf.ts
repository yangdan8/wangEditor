import { PanelConf, PanelTabConf } from "../menu-constructors/Panel";

export default function () {

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
                        <input
                            type="text"
                            placeholder="请输入视频地址"
                            >
                    </div>
                    <div>
                        <button>insert</button>
                    </div>
                </div>
            `,
            events: []
        }
    ]

    conf.tabs.push(tabsConf[0])

    return conf
}