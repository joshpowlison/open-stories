# Open Stories
A lightweight, simple infinite scroll CMS for web serial novels and webcomics. Based on storieslc.com but for single-story use. No PHP or MySQL here, just HTML, CSS, JS, and AJAX!

## CMS features

**Very easy to use** and since all the code's here, you can add whatever features you want! You can set up in less than 10 minutes if you know what you want.

**Mobile friendly** with both serial novels and comics- and a mirrored experience between desktop and mobile!

**Bi-directional infinite scroll** lets you scroll up to previous pages and down to further pages with hardly any page "jerk"!

**Revolutionary page-changing** lets you click on the page number and choose any page to jump to instantly!

**Minimalist HUD** means a clean experience for your readers and less work for you!

**Hashtags** let you share the website and direct readers to any page you want. You'll notice that when you change pages, the hashtag in the URL changes; simply share the URL with any hashtag and when somebody follows it, they will start on the page in the hashtag! This makes it really easy to share your current page. Remove the hashtag and they'll start on the last page.

## Examples

The below examples are from storieslc.com which *does* have some extra features like logins and buying Story Points, but the basics are available with Open Stories and you have more flexibility.

[Dream High School: Web serial novel with extra footer content](https://storieslc.com/dream-high-school/)

[Little Nemo in Slumberland: Webcomic with over 400 pages](https://storieslc.com/little-nemo-in-slumberland/)

[0000 Is Ma Faffritt Colour of teh Alfabeht: SVG webcomic](https://storieslc.com/0000-is-ma-faffritt-colour-of-teh-alfabeht/)

If you'd rather post through storieslc.com instead of with Open Stories, it's also free and you can contact Josh Powlison about it at [josh@storieslc.com](mailto:josh@storieslc.com) for more info.

## Setup

After download, alter these values in index.html:

1. `<title>` contents (ideally to your story name)
2. `meta` `description` (describe your story)
3. `storyColor` (to a hex color of your choice)
4. `language` (probably to "en" for English. This affects the folder you'll be pulling pages from)
5. `fileType` (probably to "html", "jpeg", or "png")
6. `fileNameLeadingZeroLength` (affects use of leading zeroes in file names)

If you're creating a comic, you'll also want to load comic.js instead of text.js, unless you're loading your comic pages through HTML files (perhaps, for example, if you're working with SVGs).

You'll also want to update your help section and footer. The footer appears after the last page of your story. You don't need to include a footer if you don't want it.

Open totalPages.txt and change its value to the total number of pages. Change its value whenever you want to update the number of total pages (like when a new part of your story goes live).

## Setting up FAQ and answers

You can set this up in the info section or in the footer. You just need to call a question and an answer by putting a class on an instance and then having a div immediately after, like this:

```
<h3 class="faqQuestion">How do I create an FAQ question?</h3>
  <div>
    <p>That sounds like a redundancy but it's not.</p>
    <p>Also, you can have multiple lines, even images here because you're placing the answer in a div!</p>
  </div>
```

This isn't just for frequently asked questions though- it can be used for an About the Author section, Character Bios, Social Media Links, whatever you want! Remember that you can add your own custom css into styles.css and can put images into answer divs!

## Naming and uploading pages
Pages are number like so: 1.html, 2.html, 3.html...

But if you're using leading zeroes, make sure to ALWAYS use leading zeroes! 001.html, 002.html, 003.html...

And always use the same extension- beware especially of .jpeg vs .jpg. The website won't find files with slightly different extensions.

Once you've created pages, just put them into your language folder for the website!

If you're using images, the process is the same, it's just 1.png, 2.png, 3.png instead.

## Text file formatting

If you know HTML, you can just write in HTML. If you don't, you can write `[AUTOFORMAT]` at the beginning of your document, double-space, and put in whatever text you want and it'll be formatted automatically (you can still add tags in such as `<strong>` and `<span>`s).

You can use `[AUTOFORMAT]` in one page and go without it in the next.

## What about commenting?

That's not available right now, but you *can* add a Twitter feed with a hashtag of your story to the footer of your story. That way readers can check out a general story conversation and jump in on it too (and connect with you on Twitter)!

## JavaScript files
There are 3 JavaScript files: one that controls general settings and is always required, one that controls the type of page layout (scroll or flip), and one that controls the type of file being loaded (text or image).

I've commented up the files pretty good, so hopefully they'll be fairly easy to follow.
