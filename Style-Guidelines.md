# Guidelines for coding style

Every big project (and I assume this is going to be several thousand lines, at least)
needs to be easily readable by all parties. This makes the code more manageable, prettier,
and overall better.

### Indentation and whitespace

Normal standards, which means HTML, CSS, and JavaScript should follow the respective best practises
when it comes to indentation and whitespace.

For this project we will use spaces instead of tabs as they're more reliable cross-platform and
cross-editor. We'll be using a tab-value of four (4).

*(In notepad++ go to Settings-Preferences-tab settings and check "replace by space" and make sure
the tab-value is set to 4.)*

In JavaScript we will be using whitespace. For example: we will write "var i = 0;" instead of
"var i=0;"

### Naming conventions

Name functions, variables, classes, and IDs descriptively. Use camelCase for naming.

### Examples

#####JavaScript
```
var someFunction() {
    for (var i = 0; i < 5; i++) {
        console.log(i);
    }
}
```
#####HTML
```
<html>
<head>
    <title>myTitle</title>
</head>

<body>
    <div class="content">
        <h2>Header</h2>
        <p>Lorem Ipsum</p>
    </div>
    <div class="imageGallery">
        <img src="example.jpg">
        <p>Description</p>
    </div>
</body>
</html>
```
#####CSS
```
.myClass {
    attribute: value;
    attribute2: value;
}
```