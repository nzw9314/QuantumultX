/*
README：https://github.com/yichahucha/surge/tree/master
 */

const console_log = false;
const imdb_apikey_cache_key = "IMDb_apikey";
const netflix_title_cache_key = "netflix_title_map";

if ($request.headers) {
    let url = $request.url;
    let url_decode = decodeURIComponent(url);

    let videos = url_decode.match(/"videos","(\d+)"/);
    let id_video = videos[1];

    let map = get_title_map();
    let title = map[id_video];
    let is_english = url.match(/languages=en/) ? true : false;
    if (!title && !is_english) {
        let current_summary = url_decode.match(/\["videos","(\d+)","current","summary"\]/);
        url = url.replace("&path=" + encodeURIComponent(current_summary[0]), "");
        url = url.replace(/&languages=(.*?)&/, "&languages=en-US&");
    }

    url += "&path=" + encodeURIComponent("[" + videos[0] + ",\"details\"]");

    $done({ url });
} else {
    var IMDb_apikeys = get_IMDb_apikeys();
    var IMDb_apikey = $persistentStore.read(imdb_apikey_cache_key);
    if (!IMDb_apikey) update_IMDb_apikey();

    let body = $response.body;
    let obj = JSON.parse(body);

    try {
        let video_id = obj.paths[0][1];
        let video = obj.value.videos[video_id];

        let map = get_title_map();
        let title = map[video_id];
        if (!title) {
            title = video.summary.title;
            set_title_map(video_id, title, map);
        }

        let year = null;
        let type = video.summary.type;
        if (type == "movie") {
            year = video.details.releaseYear;
        } else if (type == "show") {
            type = "series";
        }

        delete video.details;

        request_IMDb_rating(title, year, type, null, function (data) {
            if (data) {
                let rating_message = get_rating_message(data);
                let country_message = get_country_message(data);
                let summary = obj.value.videos[video_id].summary;
                if (summary && summary.supplementalMessage) {
                    summary.supplementalMessage = country_message + "\n" + rating_message + "\n\n" + summary.supplementalMessage;
                } else {
                    summary["supplementalMessage"] = country_message + "\n" + rating_message;
                }
            }
            body = JSON.stringify(obj);
            $done({ body });
        });
    } catch (error) {
        body = JSON.stringify(obj);
        $done({ body });
        if (console_log) console.log("Netflix Data Parsing Error:\n" + error);
    }
}

function get_title_map() {
    let map = $persistentStore.read(netflix_title_cache_key);
    if (!map) {
        map = {};
    } else {
        map = JSON.parse(map);
    }
    return map;
}

function set_title_map(id, title, map) {
    map[id] = title;
    $persistentStore.write(JSON.stringify(map), netflix_title_cache_key);
}

function request_IMDb_rating(title, year, type, season, callback) {
    let url = "https://www.omdbapi.com/?t=" + encodeURI(title) + "&apikey=" + IMDb_apikey;
    if (year) url += "&y=" + year;
    if (type) url += "&type=" + type;
    if (season) url += "&Season=" + season;
    if (console_log) console.log("Netflix IMDb Rating URL:\n" + url);
    $httpClient.get(url, function (error, response, data) {
        if (!error) {
            if (console_log) console.log("Netflix IMDb Rating response:\n" + JSON.stringify(response));
            if (console_log) console.log("Netflix IMDb Rating Data:\n" + data);
            let obj = JSON.parse(data);
            if (response.status == 200) {
                if (obj.Response != "False") {
                    callback(obj);
                } else {
                    callback(null);
                }
            } else if (response.status == 401) {
                if (IMDb_apikeys.length > 1) {
                    update_IMDb_apikey();
                    request_IMDb_rating(title, year, type, season, callback);
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        } else {
            if (console_log) console.log("Netflix IMDb Rating Error:\n" + error);
            callback(null);
        }
    });
}

function update_IMDb_apikey() {
    if (IMDb_apikey) IMDb_apikeys.splice(IMDb_apikeys.indexOf(IMDb_apikey), 1);
    let index = Math.floor(Math.random() * IMDb_apikeys.length);
    IMDb_apikey = IMDb_apikeys[index];
    $persistentStore.write(IMDb_apikey, imdb_apikey_cache_key);
}

function get_rating_message(data) {
    let ratings = data.Ratings;
    let rating_message = "IMDb:  ⭐️ N/A";
    if (ratings.length > 0) {
        let imdb_source = ratings[0]["Source"];
        if (imdb_source == "Internet Movie Database") {
            let imdb_votes = data.imdbVotes;
            let imdb_rating = ratings[0]["Value"];
            rating_message = "IMDb:  ⭐️ " + imdb_rating + "   " + imdb_votes;
            if (data.Type == "movie") {
                if (ratings.length > 1) {
                    let source = ratings[1]["Source"];
                    if (source == "Rotten Tomatoes") {
                        let tomatoes = ratings[1]["Value"];
                        rating_message += ".   Tomatoes:  🍅 " + tomatoes;
                    }
                }
            }
        }
    }
    return rating_message;
}

function get_country_message(data) {
    let country = data.Country;
    let countrys = country.split(", ");
    let emoji_country = "";
    countrys.forEach(item => {
        emoji_country += get_country_emoji(item) + " " + item + ", ";
    });
    return emoji_country.slice(0, -2);
}

function get_IMDb_apikeys() {
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

function get_country_emoji(name) {
    const emoji_map = {
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
    return emoji_map[name] ? emoji_map[name] : emoji_map["Chequered"];
}
