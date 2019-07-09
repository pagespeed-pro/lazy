/**
 * Simple test server
 */

const port = 14281;

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

function get_html(file, script, exec, modifyCallback) {


    return new Promise(function(resolve, reject) {

        var inline;
        var dataCnf;

        if (typeof script === 'object') {

            if (!("src" in script)) {
                return reject('no src');
            }

            if ("inline" in script && script.inline) {
                inline = true;
            }

            if ("data-l" in script) {
                dataCnf = script['data-l'];
                if (typeof dataCnf !== 'string') {
                    dataCnf = JSON.stringify(dataCnf);
                }
            }
        } else {
            script = {
                "src": "/lazy.js"
            }
        }

        var code;
        if (inline) {
            code = fs.readFileSync(path.resolve(__dirname, '../dist/' + script.src.substring(1)), 'utf8');
        }

        fs.readFile(path.resolve(__dirname, file), 'utf8', function(err, html) {

            if (err) {
                reject(err);
                return;
            }

            html = html.replace('<!-- IIFE -->', '<script' + ((!inline) ? ' src="' + script.src + '"' : '') + '' + ((dataCnf) ? ' data-l=\'' + dataCnf.replace(/'/g, '&apos;') + '\'' : '') + '>'+((inline) ? code : '')+'</script>');

            if (exec) {
                html = html.replace('<!-- AFTER -->', '<script>' + exec + '</script><!-- AFTER -->');
            }

            if (modifyCallback) {
                modifyCallback(html).then(function(html) {
                    resolve(html);
                });
            } else {
                resolve(html);
            }
        });

    });
}

// base test
app.get('/', function(req, res) {
    get_html('./base.html', req.query.script, req.query.exec)
        .then(function(html) {

            res.setHeader('Content-Type', 'text/html');
            res.status(200);
            res.send(html);
        })
        .catch(function(err) {
            console.log(500, err);
            res.status(500);
            res.send('HTML template not found');
        })
});

// scripts
app.get(/^\/[^\/]+\.js$/, function(req, res) {
    fs.readFile(path.resolve(__dirname, '../dist/' + req.url.substring(1)), 'utf8', function(err, js) {

        if (err) {
            console.log(500, err, 'failed to load $lazy script ' + req.url);
            res.status(500);
            res.send('failed to load $lazy script ' + req.url);
            return;
        }

        res.setHeader('Content-Type', 'application/javascript');
        res.status(200);
        res.send(js);
    });
});

app.listen(port, function() {
    console.log("Listening on " + port);
});