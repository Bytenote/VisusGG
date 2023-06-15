# VisusGG (formerly FACE-M)

VisusGG is a browser extension created by x3picF4ilx (Bytenote) & MrMaxim that is designed to improve the user experience around FACEIT's platform, by providing valuable insights into player and map statistics.

## Features

### FACEIT

This extension shows the win rates of your opponents, as well as of your teammates, on a per map basis for different time periods.
Hovering over the win percentages will display the individual player performance numbers of the accumulated team stats, thus offering a deeper understanding of each player's preferences and overall contributions.

-   See opponents win percentages during map selection
-   Toggle compare mode to see statistics for both teams
-   Switch between time frames or create custom ones
-   Compatible with all game modes, HUBs & Queues
-   Customize the win percentage colors
-   Check past games

## Steam

With the release of v2.0.0, VisusGG now showcases FACEIT account details directly on Steam profiles, giving its users a convenient way to assess both their own and others' FACEIT stats without the need to manually search for them in a new tab.

-   View FACEIT stats on Steam profiles
-   Check account status and creation date
-   Compatible with private Steam profiles

## Download

Get the extension from here:

-   [Chrome & Edge](https://chrome.google.com/webstore/detail/visusgg/kodlabmmaalpolkfolgpahbjehalecki)
-   [Firefox](https://addons.mozilla.org/en-US/firefox/addon/visusgg)

## Build from source

###### Cloning

```bash
$ git clone https://github.com/Bytenote/VisusGG.git
```

###### Installation

```bash
npm install
```

###### Development

For now we need to separate both browser versions into different builds.  
However, they will be merged as soon as Firefox implements the necessary MV3 support.

<table cellpadding="200">
<tr>
<th>
</th>
<th>
Chrome
</th>
<th>
Firefox
</th>
</tr>

<tr>
<td>
Start dev server
</td>
<td>

```bash
npm run start
```

</td>
<td>

```bash
npm run start-firefox
```

</td>
</tr>

<tr>
<td>
Build extension
</td>
<td>

```bash
npm run build
```

</td>
<td>

```bash
npm run build-firefox
```

</td>
</tr>

<tr>
<td width="20%">
Test in Browser
</td>
<td width="40%">
<ol>
<li>Open <code>chrome://extensions</code></li>
<li>Enable <i>Developer mode</i></li>
<li>Click on <i>Load unpacked</i></li>
<li>Load the entire <code>build</code> folder</li>
</ol>
</td>
<td width="40%">
<ol>
<li>Open <code>about:debugging#addons</code></li>
<li>Click on <i>Load Temporary Add-on</i></li>
<li>
Load any file from <code>build</code> folder&nbsp;&nbsp;
</li>
</ol>
</td>
</tr>

</table>
