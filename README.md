# npmupdater

![logo thingy](logo.png)

Setup [npmupdater](https://www.npmjs.com/~npmupdater) as an owner of one of
your [npm](https://www.npmjs.com/) modules and it'll update when you bump
the package.json version numbers in your repo.

*(Currently you have to use a public [Github](https://github.com) repo as the code host.)*

## How to setup

Inside your module folder, where you'd usually run `npm publish`,
just run this:

	npm owner add npmupdater

*(Please be aware of [the privileges](https://docs.npmjs.com/cli/owner) that this gives to the `npmupdater` user.)*

## How to use

Once you've merged in your sweet code on Github, bump the version
number in `packages.json`.

**npmupdater** will grab the latest from the [default branch](https://help.github.com/articles/setting-the-default-branch/)
and push it out to [npmjs.com](https://www.npmjs.com).

That's it!

<3
