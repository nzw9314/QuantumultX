function Gistify() {
    const $http = HTTP("https://api.github.com");
    return class {
        constructor(token) {
            this.headers = {
                Authorization: `token ${token}`,
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"
            };
        }

        // list all gists, return this information of a gist
        async list() {
            return $http.get({
                url: '/gists',
                headers: this.headers
            }).then(response => {
                const gists = JSON.parse(response.body);
                return gists.map(gist => {
                    const { id, public, description, created_at, updated_at } = gist;
                    const files = gist.files;
                    const filename = Object.keys(files)[0]
                    return {
                        id, filename, public, description, created: created_at, updated: updated_at
                    }
                })
            });
        }

        // retrieve the raw content of the first file with a gist id
        async get(id) {
            const url = $http.get({
                url: `/gists/${id}`,
                headers: this.headers
            }).then(response => {
                const body = JSON.parse(response.body);
                const files = body.files;
                const filename = Object.keys(files)[0];
                return files[filename];
            });
            return $http.get(url);
        }

        // create a gist with a single file, return the gist id
        async create({ description = "", public = false, name, source = "" } = {}) {
            if (!name) {
                throw new Error("You must provide the file name!");
            }
            const files = { name: { content: source } }
            return $http.post({
                url: '/gists',
                headers: this.headers,
                body: {
                    description, public, files
                }
            }).then(response => {
                const body = JSON.parse(response.body);
                const id = body.url.match(/gists\/.*/);
                return id;
            });
        }

        // update a gist with id
        async update(id, content) {
            const filename = await $http.get(`/gists/${id}`).then(response => {
                const body = JSON.parse(response.body);
                const files = body.files;
                return Object.keys(files)[0];
            })
            return $http.patch({
                url: `/gists/${id}`,
                body: { files: { [filename]: { content } } },
                headers: this.headers
            });
        }

        // delete a gist with id
        async delete(id) {
            return $http.delete(`/gists/${id}`)
        }
    }()
}

// prettier-ignore
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, o = "undefined" != typeof $httpClient && !this.isLoon, n = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: o, isNode: "function" == typeof require && !n, isJSBox: n } } function HTTP(e) { const { isQX: t, isLoon: o, isSurge: n } = ENV(); const s = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH", "PUT"].forEach(i => s[i.toLowerCase()] = (s => (function (s, i) { return (i = "string" == typeof i ? { url: i } : i).url = e ? e + i.url : i.url, t ? $task.fetch({ method: s, ...i }) : new Promise((e, t) => { (n || o ? $httpClient : require("request"))[s.toLowerCase()](i, (o, n, s) => { o ? t(o) : e({ statusCode: n.status || n.statusCode, headers: n.headers, body: s }) }) }) })(i, s))), s }