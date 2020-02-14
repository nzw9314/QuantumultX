/*
README：https://github.com/yichahucha/surge/tree/master
 */

const $tool = tool()
const consoleLog = false;
const imdbApikeyCacheKey = "IMDbApikey";
const netflixTitleCacheKey = "NetflixTitle";

if (!$tool.isResponse) {
    let url = $request.url;
    const urlDecode = decodeURIComponent(url);
    const videos = urlDecode.match(/"videos","(\d+)"/);
    const videoID = videos[1];
    const map = getTitleMap();
    const title = map[videoID];
    const isEnglish = url.match(/languages=en/) ? true : false;
    if (!title && !isEnglish) {
        const currentSummary = urlDecode.match(/\["videos","(\d+)","current","summary"\]/);
        url = url.replace("&path=" + encodeURIComponent(currentSummary[0]), "");
        url = url.replace(/&languages=(.*?)&/, "&languages=en-US&");
    }
    url += "&path=" + encodeURIComponent(`[${videos[0]},"details"]`);
    $done({ url });
} else {
    var IMDbApikeys = IMDbApikeys();
    var IMDbApikey = $tool.read(imdbApikeyCacheKey);
    if (!IMDbApikey) updateIMDbApikey();
    let obj = JSON.parse($response.body);
    if (consoleLog) console.log("Netflix Original Body:\n" + $response.body);
    const videoID = obj.paths[0][1];
    const video = obj.value.videos[videoID];
    const map = getTitleMap();
    let title = map[videoID];
    if (!title) {
        title = video.summary.title;
        setTitleMap(videoID, title, map);
    }
    let year = null;
    let type = video.summary.type;
    if (type == "movie") {
        year = video.details.releaseYear;
    } else if (type == "show") {
        type = "series";
    }
    delete video.details;
    const requestRatings = async () => {
        const IMDb = await requestIMDbRating(title, year, type);
        const Douban = await requestDoubanRating(IMDb.id);
        const IMDbrating = IMDb.msg.rating;
        const tomatoes = IMDb.msg.tomatoes;
        const country = IMDb.msg.country;
        const doubanRating = Douban.rating;
        const message = `${country}\n${IMDbrating}\n${doubanRating}${tomatoes.length > 0 ? "\n" + tomatoes + "\n" : "\n"}`;
        return message;
    }
    let msg = "";
    requestRatings()
        .then(message => msg = message)
        .catch(error => msg = error + "\n")
        .finally(() => {
            let summary = obj.value.videos[videoID].summary;
            summary["supplementalMessage"] = `${msg}${summary && summary.supplementalMessage ? "\n" + summary.supplementalMessage : ""}`;
            if (consoleLog) console.log("Netflix Modified Body:\n" + JSON.stringify(obj));
            $done({ body: JSON.stringify(obj) });
        });
}

function getTitleMap() {
    const map = $tool.read(netflixTitleCacheKey);
    return map ? JSON.parse(map) : {};
}

function setTitleMap(id, title, map) {
    map[id] = title;
    $tool.write(JSON.stringify(map), netflixTitleCacheKey);
}

function requestDoubanRating(imdbId) {
    return new Promise(function (resolve, reject) {
        const url = "https://api.douban.com/v2/movie/imdb/" + imdbId + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
        if (consoleLog) console.log("Netflix Douban Rating URL:\n" + url);
        $tool.get(url, function (error, response, data) {
            if (!error) {
                if (consoleLog) console.log("Netflix Douban Rating response:\n" + JSON.stringify(response));
                if (consoleLog) console.log("Netflix Douban Rating Data:\n" + data);
                if (response.status == 200) {
                    const obj = JSON.parse(data);
                    const rating = get_douban_rating_message(obj);
                    resolve({ rating });
                } else {
                    resolve({ rating: "Douban:  " + errorTip().noData });
                }
            } else {
                if (consoleLog) console.log("Netflix Douban Rating Error:\n" + error);
                resolve({ rating: "Douban:  " + errorTip().error });
            }
        });
    });
}

function requestIMDbRating(title, year, type) {
    return new Promise(function (resolve, reject) {
        let url = "https://www.omdbapi.com/?t=" + encodeURI(title) + "&apikey=" + IMDbApikey;
        if (year) url += "&y=" + year;
        if (type) url += "&type=" + type;
        if (consoleLog) console.log("Netflix IMDb Rating URL:\n" + url);
        $tool.get(url, function (error, response, data) {
            if (!error) {
                if (consoleLog) console.log("Netflix IMDb Rating response:\n" + JSON.stringify(response));
                if (consoleLog) console.log("Netflix IMDb Rating Data:\n" + data);
                if (response.status == 200) {
                    const obj = JSON.parse(data);
                    if (obj.Response != "False") {
                        const id = obj.imdbID;
                        const msg = get_IMDb_message(obj);
                        resolve({ id, msg });
                    } else {
                        reject(errorTip().noData);
                    }
                } else if (response.status == 401) {
                    if (IMDbApikeys.length > 1) {
                        updateIMDbApikey();
                        requestIMDbRating(title, year, type);
                    } else {
                        reject(errorTip().noData);
                    }
                } else {
                    reject(errorTip().noData);
                }
            } else {
                if (consoleLog) console.log("Netflix IMDb Rating Error:\n" + error);
                reject(errorTip().error);
            }
        });
    });
}

function updateIMDbApikey() {
    if (IMDbApikey) IMDbApikeys.splice(IMDbApikeys.indexOf(IMDbApikey), 1);
    const index = Math.floor(Math.random() * IMDbApikeys.length);
    IMDbApikey = IMDbApikeys[index];
    $tool.write(IMDbApikey, imdbApikeyCacheKey);
}

function get_IMDb_message(data) {
    let rating_message = "IMDb:  ⭐️ N/A";
    let tomatoes_message = "";
    let country_message = "";
    let ratings = data.Ratings;
    if (ratings.length > 0) {
        const imdb_source = ratings[0]["Source"];
        if (imdb_source == "Internet Movie Database") {
            const imdb_votes = data.imdbVotes;
            const imdb_rating = ratings[0]["Value"];
            rating_message = "IMDb:  ⭐️ " + imdb_rating + "    " + "" + imdb_votes;
            if (data.Type == "movie") {
                if (ratings.length > 1) {
                    const source = ratings[1]["Source"];
                    if (source == "Rotten Tomatoes") {
                        const tomatoes = ratings[1]["Value"];
                        tomatoes_message = "Tomatoes:  🍅 " + tomatoes;
                    }
                }
            }
        }
    }
    country_message = get_country_message(data.Country);
    return { rating: rating_message, tomatoes: tomatoes_message, country: country_message }
}

function get_douban_rating_message(data) {
    const average = data.rating.average;
    const numRaters = data.rating.numRaters;
    const rating_message = `Douban:  ⭐️ ${average.length > 0 ? average + "/10" : "N/A"}   ${numRaters == 0 ? "" : parseFloat(numRaters).toLocaleString()}`;
    return rating_message;
}

function get_country_message(data) {
    const country = data;
    const countrys = country.split(", ");
    let emoji_country = "";
    countrys.forEach(item => {
        emoji_country += countryEmoji(item) + " " + item + ", ";
    });
    return emoji_country.slice(0, -2);
}

function errorTip() {
    return { noData: "⭐️ N/A", error: "❌ N/A" }
}

function IMDbApikeys() {
    const apikeys = [
        "PlzBanMe", "4e89234e",
        "f75e0253", "d8bb2d6b",
        "ae64ce8d", "7218d678",
        "b2650e38", "8c4a29ab",
        "9bd135c2", "953dbabe",
        "1a66ef12", "3e7ea721",
        "457fc4ff", "d2131426",
        "9cc1a9b7", "e53c2c11",
        "f6dfce0e", "b9db622f",
        "e6bde2b9", "d324dbab",
        "d7904fa3", "aeaf88b9"];
    return apikeys;
}

function countryEmoji(name) {
    const emojiMap = {
        "Chequered": "🏁",
        "Triangular": "🚩",
        "Crossed": "🎌",
        "Black": "🏴",
        "White": "🏳",
        "Rainbow": "🏳️‍🌈",
        "Pirate": "🏴‍☠️",
        "Ascension Island": "🇦🇨",
        "Andorra": "🇦🇩",
        "United Arab Emirates": "🇦🇪",
        "Afghanistan": "🇦🇫",
        "Antigua & Barbuda": "🇦🇬",
        "Anguilla": "🇦🇮",
        "Albania": "🇦🇱",
        "Armenia": "🇦🇲",
        "Angola": "🇦🇴",
        "Antarctica": "🇦🇶",
        "Argentina": "🇦🇷",
        "American Samoa": "🇦🇸",
        "Austria": "🇦🇹",
        "Australia": "🇦🇺",
        "Aruba": "🇦🇼",
        "Åland Islands": "🇦🇽",
        "Azerbaijan": "🇦🇿",
        "Bosnia & Herzegovina": "🇧🇦",
        "Barbados": "🇧🇧",
        "Bangladesh": "🇧🇩",
        "Belgium": "🇧🇪",
        "Burkina Faso": "🇧🇫",
        "Bulgaria": "🇧🇬",
        "Bahrain": "🇧🇭",
        "Burundi": "🇧🇮",
        "Benin": "🇧🇯",
        "St. Barthélemy": "🇧🇱",
        "Bermuda": "🇧🇲",
        "Brunei": "🇧🇳",
        "Bolivia": "🇧🇴",
        "Caribbean Netherlands": "🇧🇶",
        "Brazil": "🇧🇷",
        "Bahamas": "🇧🇸",
        "Bhutan": "🇧🇹",
        "Bouvet Island": "🇧🇻",
        "Botswana": "🇧🇼",
        "Belarus": "🇧🇾",
        "Belize": "🇧🇿",
        "Canada": "🇨🇦",
        "Cocos (Keeling) Islands": "🇨🇨",
        "Congo - Kinshasa": "🇨🇩",
        "Congo": "🇨🇩",
        "Central African Republic": "🇨🇫",
        "Congo - Brazzaville": "🇨🇬",
        "Switzerland": "🇨🇭",
        "Côte d’Ivoire": "🇨🇮",
        "Cook Islands": "🇨🇰",
        "Chile": "🇨🇱",
        "Cameroon": "🇨🇲",
        "China": "🇨🇳",
        "Colombia": "🇨🇴",
        "Clipperton Island": "🇨🇵",
        "Costa Rica": "🇨🇷",
        "Cuba": "🇨🇺",
        "Cape Verde": "🇨🇻",
        "Curaçao": "🇨🇼",
        "Christmas Island": "🇨🇽",
        "Cyprus": "🇨🇾",
        "Czechia": "🇨🇿",
        "Czech Republic": "🇨🇿",
        "Germany": "🇩🇪",
        "Diego Garcia": "🇩🇬",
        "Djibouti": "🇩🇯",
        "Denmark": "🇩🇰",
        "Dominica": "🇩🇲",
        "Dominican Republic": "🇩🇴",
        "Algeria": "🇩🇿",
        "Ceuta & Melilla": "🇪🇦",
        "Ecuador": "🇪🇨",
        "Estonia": "🇪🇪",
        "Egypt": "🇪🇬",
        "Western Sahara": "🇪🇭",
        "Eritrea": "🇪🇷",
        "Spain": "🇪🇸",
        "Ethiopia": "🇪🇹",
        "European Union": "🇪🇺",
        "Finland": "🇫🇮",
        "Fiji": "🇫🇯",
        "Falkland Islands": "🇫🇰",
        "Micronesia": "🇫🇲",
        "Faroe Islands": "🇫🇴",
        "France": "🇫🇷",
        "Gabon": "🇬🇦",
        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",
        "Grenada": "🇬🇩",
        "Georgia": "🇬🇪",
        "French Guiana": "🇬🇫",
        "Guernsey": "🇬🇬",
        "Ghana": "🇬🇭",
        "Gibraltar": "🇬🇮",
        "Greenland": "🇬🇱",
        "Gambia": "🇬🇲",
        "Guinea": "🇬🇳",
        "Guadeloupe": "🇬🇵",
        "Equatorial Guinea": "🇬🇶",
        "Greece": "🇬🇷",
        "South Georgia & South Sandwich Is lands": "🇬🇸",
        "Guatemala": "🇬🇹",
        "Guam": "🇬🇺",
        "Guinea-Bissau": "🇬🇼",
        "Guyana": "🇬🇾",
        "Hong Kong SAR China": "🇭🇰",
        "Hong Kong": "🇭🇰",
        "Heard & McDonald Islands": "🇭🇲",
        "Honduras": "🇭🇳",
        "Croatia": "🇭🇷",
        "Haiti": "🇭🇹",
        "Hungary": "🇭🇺",
        "Canary Islands": "🇮🇨",
        "Indonesia": "🇮🇩",
        "Ireland": "🇮🇪",
        "Israel": "🇮🇱",
        "Isle of Man": "🇮🇲",
        "India": "🇮🇳",
        "British Indian Ocean Territory": "🇮🇴",
        "Iraq": "🇮🇶",
        "Iran": "🇮🇷",
        "Iceland": "🇮🇸",
        "Italy": "🇮🇹",
        "Jersey": "🇯🇪",
        "Jamaica": "🇯🇲",
        "Jordan": "🇯🇴",
        "Japan": "🇯🇵",
        "Kenya": "🇰🇪",
        "Kyrgyzstan": "🇰🇬",
        "Cambodia": "🇰🇭",
        "Kiribati": "🇰🇮",
        "Comoros": "🇰🇲",
        "St. Kitts & Nevis": "🇰🇳",
        "North Korea": "🇰🇵",
        "South Korea": "🇰🇷",
        "Kuwait": "🇰🇼",
        "Cayman Islands": "🇰🇾",
        "Kazakhstan": "🇰🇿",
        "Laos": "🇱🇦",
        "Lebanon": "🇱🇧",
        "St. Lucia": "🇱🇨",
        "Liechtenstein": "🇱🇮",
        "Sri Lanka": "🇱🇰",
        "Liberia": "🇱🇷",
        "Lesotho": "🇱🇸",
        "Lithuania": "🇱🇹",
        "Luxembourg": "🇱🇺",
        "Latvia": "🇱🇻",
        "Libya": "🇱🇾",
        "Morocco": "🇲🇦",
        "Monaco": "🇲🇨",
        "Moldova": "🇲🇩",
        "Montenegro": "🇲🇪",
        "St. Martin": "🇲🇫",
        "Madagascar": "🇲🇬",
        "Marshall Islands": "🇲🇭",
        "North Macedonia": "🇲🇰",
        "Mali": "🇲🇱",
        "Myanmar (Burma)": "🇲🇲",
        "Mongolia": "🇲🇳",
        "Macau Sar China": "🇲🇴",
        "Northern Mariana Islands": "🇲🇵",
        "Martinique": "🇲🇶",
        "Mauritania": "🇲🇷",
        "Montserrat": "🇲🇸",
        "Malta": "🇲🇹",
        "Mauritius": "🇲🇺",
        "Maldives": "🇲🇻",
        "Malawi": "🇲🇼",
        "Mexico": "🇲🇽",
        "Malaysia": "🇲🇾",
        "Mozambique": "🇲🇿",
        "Namibia": "🇳🇦",
        "New Caledonia": "🇳🇨",
        "Niger": "🇳🇪",
        "Norfolk Island": "🇳🇫",
        "Nigeria": "🇳🇬",
        "Nicaragua": "🇳🇮",
        "Netherlands": "🇳🇱",
        "Norway": "🇳🇴",
        "Nepal": "🇳🇵",
        "Nauru": "🇳🇷",
        "Niue": "🇳🇺",
        "New Zealand": "🇳🇿",
        "Oman": "🇴🇲",
        "Panama": "🇵🇦",
        "Peru": "🇵🇪",
        "French Polynesia": "🇵🇫",
        "Papua New Guinea": "🇵🇬",
        "Philippines": "🇵🇭",
        "Pakistan": "🇵🇰",
        "Poland": "🇵🇱",
        "St. Pierre & Miquelon": "🇵🇲",
        "Pitcairn Islands": "🇵🇳",
        "Puerto Rico": "🇵🇷",
        "Palestinian Territories": "🇵🇸",
        "Portugal": "🇵🇹",
        "Palau": "🇵🇼",
        "Paraguay": "🇵🇾",
        "Qatar": "🇶🇦",
        "Réunion": "🇷🇪",
        "Romania": "🇷🇴",
        "Serbia": "🇷🇸",
        "Russia": "🇷🇺",
        "Rwanda": "🇷🇼",
        "Saudi Arabia": "🇸🇦",
        "Solomon Islands": "🇸🇧",
        "Seychelles": "🇸🇨",
        "Sudan": "🇸🇩",
        "Sweden": "🇸🇪",
        "Singapore": "🇸🇬",
        "St. Helena": "🇸🇭",
        "Slovenia": "🇸🇮",
        "Svalbard & Jan Mayen": "🇸🇯",
        "Slovakia": "🇸🇰",
        "Sierra Leone": "🇸🇱",
        "San Marino": "🇸🇲",
        "Senegal": "🇸🇳",
        "Somalia": "🇸🇴",
        "Suriname": "🇸🇷",
        "South Sudan": "🇸🇸",
        "São Tomé & Príncipe": "🇸🇹",
        "El Salvador": "🇸🇻",
        "Sint Maarten": "🇸🇽",
        "Syria": "🇸🇾",
        "Swaziland": "🇸🇿",
        "Tristan Da Cunha": "🇹🇦",
        "Turks & Caicos Islands": "🇹🇨",
        "Chad": "🇹🇩",
        "French Southern Territories": "🇹🇫",
        "Togo": "🇹🇬",
        "Thailand": "🇹🇭",
        "Tajikistan": "🇹🇯",
        "Tokelau": "🇹🇰",
        "Timor-Leste": "🇹🇱",
        "Turkmenistan": "🇹🇲",
        "Tunisia": "🇹🇳",
        "Tonga": "🇹🇴",
        "Turkey": "🇹🇷",
        "Trinidad & Tobago": "🇹🇹",
        "Tuvalu": "🇹🇻",
        "Taiwan": "🇨🇳",
        "Tanzania": "🇹🇿",
        "Ukraine": "🇺🇦",
        "Uganda": "🇺🇬",
        "U.S. Outlying Islands": "🇺🇲",
        "United Nations": "🇺🇳",
        "United States": "🇺🇸",
        "USA": "🇺🇸",
        "Uruguay": "🇺🇾",
        "Uzbekistan": "🇺🇿",
        "Vatican City": "🇻🇦",
        "St. Vincent & Grenadines": "🇻🇨",
        "Venezuela": "🇻🇪",
        "British Virgin Islands": "🇻🇬",
        "U.S. Virgin Islands": "🇻🇮",
        "Vietnam": "🇻🇳",
        "Vanuatu": "🇻🇺",
        "Wallis & Futuna": "🇼🇫",
        "Samoa": "🇼🇸",
        "Kosovo": "🇽🇰",
        "Yemen": "🇾🇪",
        "Mayotte": "🇾🇹",
        "South Africa": "🇿🇦",
        "Zambia": "🇿🇲",
        "Zimbabwe": "🇿🇼",
        "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    }
    return emojiMap[name] ? emojiMap[name] : emojiMap["Chequered"];
}

function tool() {
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isResponse = typeof $response != "undefined"
    const node = (() => {
        if (typeof require == "function") {
            const request = require('request')
            return ({ request })
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (node) console.log(JSON.stringify({ title, subtitle, message }));
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (node) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (node) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    return { isQuanX, isSurge, isResponse, notify, write, read, get, post }
}
