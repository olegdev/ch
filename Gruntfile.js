var dictionary = require('./server/services/dictionary/dictionary.js');
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
                json;
            if (!/^\/\/@ignore/.test(str) && filename.substr(filename.length-2) == 'js') {                            
                //данные
                json = grunt.file.read(abspath + 'on');

                // перевод
                var matches = json.match(/dictionary\([A-Z0-9_]+\)/gi);
                if (matches && matches.length) {
                    matches.forEach(function(m) {
                        var index = m.search(/\([A-Z0-9_]+\)/i);
                        if (index != -1) {
                            var key = m.substr(index+1);
                            key = key.substr(0,key.length-1); // удаляю скобки
                            json = json.replace(m, dictionary.get(key));
                        }
                    });
                }

                // вставляю переведенные данные в файл клиентского модуля
                str = str.replace('Reference.data = JSON.parse(require(\'fs\').readFileSync(__filename + \'on\', \'utf8\'));', 'Reference.data = ' + json + ';');

                // оборачиваю в модуль requirejs
                str = 'define(function() {\nvar module = {exports: {}};\n' + str + '\nreturn module.exports; });';

                // и кладу в нужную папку под тем же именем
                grunt.file.write(options.dest + '/' + filename, str, {encoding: 'utf8'});
            }
        });

    });

    grunt.registerTask('dictionary', 'Обновляние словаря', function() {
        var options = this.options();        

        grunt.file.recurse(options.src, function(abspath, rootdir, subdir, filename) {
            var dictionary,
                json,
                keys = [],
                oldKeys = [];

            if (filename.substr(filename.length-2) == 'json') {
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
                
                // достаю словарь если он есть
                if (fs.existsSync(options.dest + '/' + filename)) {
                    dictionary = JSON.parse(fs.readFileSync(options.dest + '/' + filename, 'utf8'));
                } else {
                    dictionary = {};
                }

                // вставляю новые ключи, оставляя перевод
                for(var i = 0; i < keys.length; i++) {
                    if (!dictionary[keys[i]]) {
                        dictionary[keys[i]] = keys[i];
                    }
                }

                // удаляю устаревшие ключи
                oldKeys = _.difference(_.keys(dictionary), keys);
                for(var i = 0; i < oldKeys.length; i++) {
                    delete dictionary[oldKeys[i]];
                }
                
                // и записываю файл словаря
                grunt.file.write(options.dest + '/' + filename, JSON.stringify(dictionary), {encoding: 'utf8'});
            }
        });

    });

};