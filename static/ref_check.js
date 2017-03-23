/**
 * Miscellaneous checks for conformity with APA citation and format style.
 *
 * @see
 */
var apacheck = {

    /** @type {String} Regex pattern for a year: NNNN or n.d. */
    year: '(\\d\\d\\d\\d|n\.d\.)',

    rules: [
        {
            description: 'A description of the rule.',
            /**
             * Returns a list of excerpts for each violation of the rule.
             *
             * @param string body The portion of the document before the "References" heading.
             * @param string references The portion of the document after the "References" heading.
             *
             * @return Array|null An array of short excerpts around each violation.
             */
            check: function (references) {
                return [];
            }
        },
        
        {
            description: 'References: Put period after date.',
            check: function (references) {
                var regexp = XRegExp(
                    '('
                  +     '.{0,10}'                        // 10 characters of context
                  +     '\\('+apacheck.year+'[^)]*\\)'   // The date
                  +     '[^.]'                           // No period
                  +     '.{0,10}'                        // 10 characters of context
                  + ')'
                , 'g');
                var res = []
                for (i in references) {
                    var r = references[i].match(regexp) || [];
                    res = res.concat(r)
                }
                return res;
            }
        },
        {
            description: 'References: Put & before last author.',
            check: function (references) {
                var regexp = XRegExp(
                    '('
                  +     '^'                     // Start of the line
                  +     '[^(,]+'                // Non-comma characters
                  +     ','                     // Comma
                  +     '[^(,]+'                // Non-comma characters
                  +     ','                     // Comma
                  +     '('
                  +         '(?!\\. \\. \\.)'
                  +         '(?!\\.\\.\\.)'     // Does not already have & or . . .
                  +         '[^(&]'
                  +     ')+'
                  +     '\\('                   // (
                  + ')'
                , 'g');
                var res = []
                for (i in references) {
                    var r = references[i].match(regexp) || [];
                    res = res.concat(r)
                }
                return res;
            }
        },
        {
            description: 'References: Consider lowercasing the words in this title if it is for an article.',
            check: function (references) {
                var regexp = XRegExp(
                    '('
                  +     '\\)\\.\\s*' // ). followed by whitespace
                  +     '[A-Z]'      // First letter is uppercase
                  +     '[^.:]*'     // Any characters other than . or :
                  +     '[A-Z]'      // Uppercase letter
                  +     '[^.]*'      // Any characters other than .
                  +     '\\.'        // .
                  + ')'
                , 'g');
                var res = []
                for (i in references) {
                    var r = references[i].match(regexp) || [];
                    res = res.concat(r)
                }
                return res;
            }
        },
    ],
    /**
     * Returns an object whose keys are rule descriptions and values are arrays
     * of excerpts around each violation.
     *
     * @param string s The document to check.
     *
     * @return Object Error excerpts keyed by rule descriptions.
     */
    check: function (s) {
        var refs = s.split('\n')
        //console.log('refs: ', refs)
        var results = {};
        $.each(this.rules, function (i, rule) {
            var excerpts = rule.check(refs);
            if (excerpts.length > 0) {
                results[rule.description] = excerpts;
            }
        })
        return results;
    },
}