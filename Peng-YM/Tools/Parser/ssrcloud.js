function filter(nodes) {
    const names = nodes.names;
    const region = $.filter(names, /日本|港|美国|新加坡|台湾/);
    const iplc = $.filter(names, /IPLC|IEPL/i);
    return AND(region, iplc);
}

function rename(nodes) {
    let names = nodes.names;

    const map = {};
    const pad = (num, size = 2) => {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    return names.map(prev => {
        const regex = /(日本|港|美国|新加坡|台湾)/;
        if (regex.test(prev)) {
            let name = `${prev.match(regex)[1]}`;
            if (!map[name]) {
                map[name] = 0;
            }
            map[name] = map[name] + 1;
            name += `-${pad(map[name])}`;
            name = name.replace("港", "🇭🇰 HK");
            name = name.replace("日本", "🇯🇵 JP");
            name = name.replace("美国", "🇺🇸 US");
            name = name.replace("新加坡", "🇸🇬 SG");
            name = name.replace("台湾", "🇨🇳 TW");

            return name;
        }
        return prev;
    })
}

const nodes = {
    names: ["中国-台湾桃园 IPLC 台湾固网 C11 Netflix 动画疯", "中国-英国伦敦 IPLC BBC C01", "中国-台湾桃园 IPLC 台湾固网 C13 Netflix 动画疯"]
}

const $ = Tools().rename;
console.log(rename(nodes))

/*********************************************************************************/
function Tools() {
    const filter = (src, ...regex) => {
        const initial = [...Array(src.length).keys()].map(() => false);
        return regex.reduce((a, expr) => OR(a, src.map(item => expr.test(item))), initial)
    }

    const rename = {
        replace: (src, old, now) => {
            return src.map(item => item.replace(old, now));
        },

        delete: (src, ...args) => {
            return src.map(item => args.reduce((now, expr) => now.replace(expr, ''), item));
        },

        trim: (src) => {
            return src.map(item => item.trim().replace(/[^\S\r\n]{2,}/g, ' '));
        }
    }

    return {
        filter, rename
    }
}

function AND(...args) {
    return args.reduce((a, b) => a.map((c, i) => b[i] && c));
}

function OR(...args) {
    return args.reduce((a, b) => a.map((c, i) => b[i] || c))
}

function NOT(array) {
    return array.map(c => !c);
}