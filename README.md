# Description

Single page website based on [Bootstrap](https://getbootstrap.com/). Integrates [MathJax](https://www.mathjax.org/) for displaying LaTeX-style math, and [highlight.js](https://highlightjs.org/) for beautiful code display.

__Dependencies__:

The following dependencies are linked to

* Bootstrap: 3.4.1
* highlight.js: 11.2.0
* MathJax: 2.7.9
* jQuery: 1.12.4

Furthermore, the template uses the Google fonts _Lato_ and _Merriweather_ which are however provided in this repository.

## Demo

See <https://skleinbo.github.io/class_website> for a demonstration.

## Building

__Requirements:__

A recent version of [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

__Build:__

1. Clone the repository and install dependencies

    ```shell
    git clone https://github.com/skleinbo/class_website
    npm install
    ```

2. Open `gulpfile.js` and look for the line starting with `const DISTROOT`. Adapt the value to reflect the root directory of the web server the page will be hosted on. For example, if the site will be reachable at `https://institution.edu/myname/myclass/`, you will likely need to set `const DISTROOT = "/myname/myclass"`.
3. Build for distribution

    ```shell
    BUILD_ENV='dist' gulp
    ```

    The compiled files and all assets are placed into the folder `dist`.
  
__OR__

2. Build for testing and development

    ```shell
    gulp
    ```

    This builds all assets and places them into `dev`. As long as the `gulp` process is running, changes made to the source files trigger a new build and are reflected immediately in the live view.

## Customization

### Colors

`less/default.less` defines a range of color variables:

```css
@base: darken(#2d2d34,10%);
@base-light: lighten(@base,10%);
@secondary: lighten(#D0E1F9,80%);
@links: @base-light;
@links-light: lighten(@links,75%);
@text: #1E1F26;
@text-light: @secondary;
```

Try changing `@base,@secondary` and `@text` for a start.

### Assets

The contents of `css/`, `fonts/`, `img/`, `js/`, `material/` is  copied over to the build directory. Store your assets in them.

### Plugins

If you do not require `MathJax` or `highlight.js` support, open `pages/index.njk` and at the top set the respective variables
`useMathJax` or `useHighlight` to false.

## TODO

* Upgrade to Bootstrap@5 and Sass.
* Upgrade to MathJax@3
