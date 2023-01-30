# FACE-M

FACE-M is a browser extension created by x3picF4ilx (Bytenote) & MrMaxim that shows map stats of your opponents for current and past FACEIT matches.  
You can also activate the "Compare Mode" to get statistics of your own team.

By hovering over the win percentage you will see individual player performance numbers in a popup.

# Features

-   See opponents win percentage (%) during map selection
-   Toggle compare mode to see statistics for both teams
-   Switch between time frames or create custom ones
-   Useable for all game modes, HUBs & Queues
-   Customize the win percentage (%) colors
-   Check past games

# Download

Get the extension from here:

-   [Chrome & Edge](https://chrome.google.com/webstore/detail/face-m/kodlabmmaalpolkfolgpahbjehalecki)
-   Firefox - TBA

# Build from source

###### Cloning

```bash
$ git clone https://github.com/Bytenote/FACE-M.git
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
