# open-stories
A lightweight, simple infinite scroll CMS for web serial novels and webcomics. Based on my setup at storieslc.com but with a focus for single-story use and without logins and story points. No PHP or MySQL here, just HTML, CSS, and JS.

# How it works
You just need to download the files, change some values in index.html and add pages to your langauge folder, and you're all set!

Simply download and alter these values:
1. Website title (ideally to your story name)
2. Website description
3. storyColor (to a hex of your choice)
4. language (probably to "en" for English. This affects the folder you'll be pulling pages from)
5. totalPages (may need to be updated regularly. Or, if your story's complete, just leave it at whatever you want!)
6. fileType (probably to "html", "jpeg", or "png")
7. fileNameLeadingZeroLength (affects use of leading zeroes in file names)

You'll also want to update your help section, your footer, and, of course, your pages!

# Updating pages
Page names are just numbers: 1.html, 2.html, 3.html...
If you're using leading zeroes, make sure to ALWAYS use leading zeroes! 001.html, 002.html, 003.html...
And always use the same extension- especially beware of .jpeg vs .jpg. A difference even that slight will mess with the website.

Once you've created them, just put them into your language folder for the website! (probably "en")

# Other stuff
Everything else you need to know should be laid out in index.html.

# For other developers
There are 3 JavaScript files: one that controls general settings, one that controls the type of page layout (scroll or flip), and one that controls the type of file being loaded (text or image).

I've commented up the files pretty good, so hopefully they'll be fairly easy to follow.
