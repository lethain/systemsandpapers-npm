/*
Usage:
var sid = "<system id>"
var token = "<token>"
function solve(input) {
    // change input into output somehow
    return input
}

attempt(sid, token, solve)
*/

require("request")
var rp = require("request-promise")

function consoleAll(title, txt) {
    var out = "<p><b>" + title + "</b></p>";
    out += "<table><thead><tr><th>#</th><th>Line</th></tr></thead><tbody>"
    var i = 1;
    txt.toString().split('\n').forEach(function(line) {
	out += "<tr><td>" + i.toString() + "</td><td>" + line + "</td></tr>"
	i += 1
    });
    out += "</tbody></table>"
    console.log(out);
}

function download(sid) {
    var url = `https://systemsandpapers.com/systems/${sid}/input/`
    return rp(url)
}

function upload(sid, data, token) {
    var url = `https://systemsandpapers.com/systems/${sid}/output/?token=${token}`
    return rp({uri: url, method: 'POST', body: data})
}

function attempt(sid, token, solver) {
    download(sid).then(function(html) {
	consoleAll('Input', html)
	var solution = solver(html)
	consoleAll("Proposed Solution", solution)
	upload(sid, solution, token)
	    .then(function(html) {
		consoleAll("Success", html)
	    }).catch(function(error) {
		msg = error.message.slice(4).replace("\\n", "\n")
		consoleAll("Failure", msg)
	    });
    });
}

exports.attempt = attempt
exports.download = download
exports.upload = upload



