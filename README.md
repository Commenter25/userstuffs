# Commenter25/userstuffs
a collection of userstyles and userscripts i made that aren't big enough projects for their own repo

## ⭳ Downloads
🎨 = UserStyle | 📜 = UserScript  
For userstyles, [Stylus is recommended](https://github.com/openstyles/stylus#stylus). For userscripts, [Violentmonkey is recommended](https://violentmonkey.github.io/).  
Click a name, and if you have a working extension, an install window should appear.

### 🎨 [Dark Example](https://raw.githubusercontent.com/Commenter25/userstuffs/main/darkexample/darkexample.user.css)

[**1.0.0**](darkexample/CHANGELOG.md) - _Applies to `example.com`, `example.net`, and `example.org`_

Native dark mode will be everywhere. Even Example Domain.

![Dark Example Preview Image](darkexample/preview.png)

### 🎨 [raevision](https://raw.githubusercontent.com/commenter25/userstuffs/main/raevision/raevision.user.css)

[**1.0.0**](raevision/changelog.md) - _applies to everything, everywhere_

hate uppercase letters? do they fill you with spite? hatred? would you rather everything be small, [nano](https://twitter.com/nano_pone) sized letters? now nobody has a choice! all you will ever see is lowercase letters. unless they're in an image. or not in your browser. or some weird css specificity edge case overrides this.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="raevision/preview-dark.png">
  <img alt="raevision preview image" src="raevision/preview.png">
</picture>

### 📜 [Reference Detector](https://raw.githubusercontent.com/Commenter25/userstuffs/main/refdetect/refdetect.user.js)

[**1.0.0**](refdetect/CHANGELOG.md) - _applies to everything, everywhere_

We've all wandered the web and wondered "wow, i wonder if what i'm witnessing is a reference to something?". Never live in doubt again, for this script uses the tried and true clickbait strategy of red circles to draw your eyes to any reference you wish!

...as long as the website you're on:
  - does not have a strict content security policy
  - does not overuse `overflow: hidden`
  - does not have overly specific styling

By default, it will detect [nano](https://nano.lgbt) references, and you can configure it to anything you wish!

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="refdetect/preview-dark.png">
  <img alt="Reference Detector Preview Image" src="refdetect/preview.png" style="position: relative; left: -1.8em">
</picture>

### 🎨 [Transparent Standalone Images](https://raw.githubusercontent.com/Commenter25/userstuffs/main/tpimgs/tpimgs.user.css)

[**1.0.0**](tpimgs/CHANGELOG.md) - _Applies to any URL containing `png`, `webp`, or `gif`_

Recreation of the [identically named Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/transparent-standalone-image/), which fixes a bug with directly viewed transparent images rendering on a white background. There are likely limitations compared to the extension, but for most purposes it should work without requiring trusting an entire browser extension. Feel free to report anything it doesn't catch!

![Transparent Standalone Images Preview Image](tpimgs/preview.png)

### 🎨 [Xenia as Linux Icon](https://raw.githubusercontent.com/Commenter25/userstuffs/main/xeniasteam/xeniasteam.user.css)

[**1.0.2**](xeniasteam/CHANGELOG.md) - _Applies to `steampowered.com`_

Replaces the SteamOS/Linux icon with the real Linux mascot. Credit to [Zaeroses](https://chitter.xyz/@Zaeroses) for the [Xenia SVG](https://github.com/Zaeroses/refind-icons/blob/main/os_linux.svg), which is under the Unlicense. And credit to [nano](https://nano.lgbt) for the idea!

![Xenia as Linux Icon Preview Image](xeniasteam/preview.png)

## © Licenses & Distribution
Userstyles are probably under the Unlicense, and userscripts are probably under the MIT license. Check the individual files for their correct license to be sure.

For a multitude of reasons, I **do not publish my styles on userstyles.org**, and neither should you. The only official sources are this repository (Commenter25/userstuffs) and my mirrored versions on userstyles.world. It's important to trust even your userstyles, as [CSS injection attacks do exist](https://www.mike-gualtieri.com/css-exfil-vulnerability-tester).

My userscripts are currently only available on this repository.
