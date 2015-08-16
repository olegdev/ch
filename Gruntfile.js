GLOBAL.BASE_PATH = __dirname;
GLOBAL.SERVICES_PATH = __dirname + '/server/services';

var dictionary = require('./server/services/dictionary/dictionary');
var fs = require('fs');
var _ = require('underscore');

module.exports = function(grunt) {

    grunt.initConfig({
        references: {
            options:{
                src: './server/services/references',
                dest: './client/js/references',
            }
        },
        dictionary: {
            options:{
                src: './server/services/references',
                dest: './server/services/dictionary',
            }
        },
    });

    grunt.registerTask('references', 'Обработка справочников для клиента', function() {
        var options = this.options();        

        grunt.file.recurse(options.src, function(abspath, rootdir, subdir, filename) {
            var str = grunt.file.read(abspath),
                json, jsonCopy, lang, strCopy;
            if (!/^\/\/@ignore/.test(str) && filename.substr(filename.length-2) == 'js') {

                //данные
                json = grunt.file.read(abspath + 'on');

                // для каждого языка
                for(var k = 0; k < dictionary.langs.length; k++) {
                    lang = dictionary.langs[k];
                    jsonCopy = '' + json;
                    strCopy = '' + str;

                    // создаю папку если ее еще нет
                    if (!fs.existsSync(options.dest + '/' + lang)) {
                        fs.mkdirSync(options.dest + '/' + lang);
                    }

                    // перевод
                    var matches = jsonCopy.match(/dictionary\([A-Z0-9_]+\)/gi);
                    if (matches && matches.length) {
                        matches.forEach(function(m) {
                            var index = m.search(/\([A-Z0-9_]+\)/i);
                            if (index != -1) {
                                var key = m.substr(index+1);
                                key = key.substr(0,key.length-1); // удаляю скобки
                                jsonCopy = jsonCopy.replace(m, dictionary.get(lang, key));                                
                            }
                        });
                    }

                    // вставляю переведенные данные в файл клиентского модуля
                    strCopy = strCopy.replace('Reference.data = JSON.parse(require(\'fs\').readFileSync(__filename + \'on\', \'utf8\'));', 'Reference.data = ' + jsonCopy + ';');

                    // оборачиваю в модуль requirejs
                    strCopy = 'define(function() {\nvar module = {exports: {}};\n' + strCopy + '\nreturn module.exports; });';

                    // и кладу в нужную папку под тем же именем
                    grunt.file.write(options.dest + '/' + lang + '/' + filename, strCopy, {encoding: 'utf8'});
                }
            }
        });

    });

    grunt.registerTask('dictionary', 'Обновляние словаря', function() {
        var options = this.options();        

        grunt.file.recurse(options.src, function(abspath, rootdir, subdir, filename) {
            var dic,
                json,
                keys = [],
                oldKeys = [],
                noChanges = true;

            if (filename.substr(filename.length-4) == 'json') {
                //данные справочника
                json = grunt.file.read(abspath);

                // нахожу все ключи 
                var matches = json.match(/dictionary\([A-Z0-9_]+\)/gi);
                if (matches && matches.length) {
                    matches.forEach(function(m) {
                        var index = m.search(/\([A-Z0-9_]+\)/i);
                        if (index != -1) {
                            var key = m.substr(index+1);
                            key = key.substr(0,key.length-1); // удаляю скобки
                            keys.push(key);
                        }
                    });
                }

                // для каждого языка
                for(var k = 0; k < dictionary.langs.length; k++) {
                    var lang = dictionary.langs[k];
                    // создаю папку если ее еще нет
                    if (!fs.existsSync(options.dest + '/' + lang)) {
                        fs.mkdirSync(options.dest + '/' + lang);
                    }
                    // достаю словарь если он есть
                    if (fs.existsSync(options.dest + '/' + lang + '/' + filename)) {
                        dic = JSON.parse(fs.readFileSync(options.dest + '/' + lang + '/' +filename, 'utf8'));
                    } else {
                        dic = {};
                    }

                    // вставляю новые ключи, оставляя перевод
                    for(var i = 0; i < keys.length; i++) {
                        if (!dic[keys[i]]) {
                            dic[keys[i]] = keys[i];
                            noChanges = false;
                        }
                    }

                    // удаляю устаревшие ключи
                    oldKeys = _.difference(_.keys(dic), keys);
                    if (oldKeys.length) {
                        for(var i = 0; i < oldKeys.length; i++) {
                            delete dic[oldKeys[i]];
                        }
                        noChanges = false;
                    }
                    
                    // и записываю файл словаря
                    if (!noChanges) {
                        grunt.file.write(options.dest + '/' + lang + '/' + filename, JSON.stringify(dic), {encoding: 'utf8'});
                    }
                }
            }
        });

    });

};