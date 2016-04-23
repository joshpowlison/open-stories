# Open Stories
A lightweight and minimalist CMS for seamless reading of web serial novels and webcomics. Based on storieslc.com. You can read your story with infinite scroll or by turning pages- either way, pages are preloaded!

This isn't a Wordpress plugin, it's a standalone CMS. But since it's Open Source, you can add in everything you need!

Minimal HTML knowledge required for a basic site.

## Features

**Very easy to use** and, of course, you can add whatever features you want! You can get up in less than 10 minutes if you know what you want.

**Mobile friendly** with both serial novels and comics- and a mirrored experience between desktop and mobile!

**Bi-directional infinite scroll** lets you scroll up to previous pages and down to further pages with hardly any page "jerk"!

Alternatively, **pre-loaded pages with page flip** let you keep reading without waiting for the next page to load!

**Revolutionary page-changing** lets you click on the page number and choose any page to jump to instantly!

**Minimalist HUD** means a clean experience for your readers and less extraneous design work for you!

## Examples

The below examples are from storieslc.com which *does* have some extra features like logins and buying Story Points, but the basics are available with Open Stories and you have more flexibility.

[Dream High School: Web serial novel with extra footer content](https://storieslc.com/dream-high-school/)

[Little Nemo in Slumberland: Webcomic with over 400 pages](https://storieslc.com/little-nemo-in-slumberland/)

[0000 Is Ma Faffritt Colour of teh Alfabeht: SVG webcomic](https://storieslc.com/0000-is-ma-faffritt-colour-of-teh-alfabeht/)

## Open Stories vs Stories

With Open Stories, you have full control of the design and function of your website.

With Stories, you have less work and more integrated features.

Both are free.

**Pros of Open Stories**
- Customize your site however you like
- Add features to the site not currently included
- No 10% Stories fee for user payments
- Use your own web domain
- Can use with things other than stories
- Post your story's pages whenever you want

**Pros of Stories**
- Automatic site updates
- Get new features by Josh Powlison before they're added to Open Stories
- Integrated payment system and Story Points
- storieslc.com email address and automated newsletters
- User accounts/users can save their spot across devices
- Automatically scheduled story updates

If you want to work with Stories instead of Open Stories, contact Josh Powlison at [josh@storieslc.com](mailto:josh@storieslc.com).

## Setup

After download, alter these values in index.html:

1. `<title>` contents (ideally to your story name)
2. `meta` `description` (describe your story)
3. `storyColor` (to a hex color of your choice)
4. `language` (if other than English. This affects the folder you'll be pulling pages from)
5. `fileType` (probably to "html", "jpeg", or "png")
6. `fileNameLeadingZeroLength` (affects use of leading zeroes in file names)

You'll also want to update your help section and footer. The footer appears after the last page of your story. You don't need to include a footer if you don't want it.

Open totalPages.txt and change its value to the total number of pages. Change its value whenever you want to update the number of total pages (like when a new part of your story goes live).

## Updating the number of pages

Just edit and reupload total-pages.txt. But be careful: people can still access your pages if they know the URLs for them, whether or not total-pages.txt includes them. If you upload pages earlier, sneaky people can easily find them.

## Linking to a particular page

Just add a hashtag with a number to your url to send your users to any page. For example, on my site [https://storieslc.com/dream-high-school/#1](https://storieslc.com/dream-high-school/#1) will take you to page 1 while [https://storieslc.com/dream-high-school/#50](https://storieslc.com/dream-high-school/#50) will take you to page 50.

A url without a hashtag will take users to the last page or, once bookmarks are set up, to the last page they were reading.

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
Pages are numbered like so: 1.html, 2.html, 3.html...

But if you're using leading zeroes, make sure to ALWAYS use leading zeroes! 001.html, 002.html, 003.html...

And always use the same extension- beware especially of .jpeg vs .jpg. The website won't find files with slightly different extensions. If you have to use just 1 extension for page, use .html

Once you've created pages, just put them into your language folder for the website!

If you're using images, the process is the same, it's just 1.png, 2.png, 3.png instead.

## Text file formatting

If you don't know HTML, you can write `[AUTOFORMAT]` at the beginning of your document, double-space, and put in whatever text you want and it'll be formatted automatically (you can still add tags in such as `<strong>` and `<span>`s).

You can use `[AUTOFORMAT]` in one page and go without it in the next.

If you do know HTML, just write in raw HTML. Note that you don't need `<html>`, `<head>`, or `<body>` tags- in fact, those can throw errors. Just start with your `<h1>` or `<p>` tags, just whatever you'd put between your `<body>` tags.

## What about commenting?

Commenting on a per-page basis isn't available out of the box, but you should be able to add Disqus, a Twitter feed, or other commenting software to the footer of your story pretty easily.

## Hosting

You gotta host your Open Stories site yourself. If you're cool with yourwebsitename.neocities.com, I strongly recommend checking out [Neocities](https://neocities.org/)- but you're limited in space, so if you're doing a webcomic you'll need something else.

I strongly recommend [A Small Orange](http://asmallorange.7eer.net/c/184285/185398/3107) for story hosting, and not just cause that's an affiliate link! They're seriously boss in both prices and customer service. Even if that wasn't an affiliate link I'd be like "yeah A Small Orange!"

## Crediting Open Stories

If you use and like Open Stories, please spread the word! Feel free to include the text "Open Stories, created by Josh Powlison" on the site with a link back here, but that's not a requirement.

I'd also love to hear your feedback, so send it my way!
