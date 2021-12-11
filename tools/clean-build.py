import os
import re

# @import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin);
reg = re.compile(r'@import url\(http.+\);')
path = 'build/static/css'


if __name__ == '__main__':
    for fn in os.listdir(path):
        if fn.endswith('.css'):
            with open(os.path.join(path, fn), 'r+', encoding='utf-8') as fp:
                def repl(m):
                    print(fn + ':', 'deleting', m[0])
                    return ''

                s = fp.read()
                t, c = reg.subn(repl, s)
                if c:
                    fp.seek(0)
                    fp.write(t)
                    fp.truncate()
                else:
                    print(fn, 'is clean')
