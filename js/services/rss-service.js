/**
 * RSS Service
 * Handles RSS feed parsing and post loading
 */

/**
 * Parses RSS feed item into post object
 * @param {Element} item - RSS item element
 * @returns {Object|null} Post object or null if parsing fails
 */
function parseRSSItem(item) {
  try {
    const post = { style: {} };
    const titlePrefix = "<![CDATA[";
    
    // Get title
    const titleElement = item.querySelector("title");
    if (!titleElement) return null;
    
    let title = titleElement.innerHTML;
    title = title.substr(
      titlePrefix.length,
      title.length - 3 - titlePrefix.length
    );
    
    // Get link
    const linkElement = item.querySelector("link");
    const link = linkElement ? linkElement.innerHTML : "";
    
    // Get image
    let img = item.getElementsByTagName("media:thumbnail")[0];
    if (img) img = img.attributes[0].nodeValue;
    
    // Get description
    let desc = item.querySelector("description");
    if (desc) {
      desc = desc.innerHTML;
      desc = desc.substr(
        titlePrefix.length,
        desc.length - 3 - titlePrefix.length
      );
    }

    // Format the date
    const dateElement = item.querySelector("pubDate");
    let date = dateElement ? dateElement.innerHTML : "";
    if (date) {
      date = date.split(" ");
      date = date.slice(0, 4);
      date = date.join(" ");
    }

    // Create the blog post item (sanitized)
    post.title = `<h2>${title}</h2>`;
    post.date = `<p>${date}</p>`;
    post.link = link;
    post.img = img ? img : null;
    post.desc = `<p>${desc}</p>`;
    
    return post;
  } catch (error) {
    console.error("Error parsing RSS item:", error);
    return null;
  }
}

/**
 * Parses HTML page to extract post data
 * @param {string} html - HTML string to parse
 * @param {string} url - URL of the page
 * @returns {Object|null} Post object or null if parsing fails
 */
function parseHTMLPost(html, url) {
  try {
    const post = { style: {} };
    const doc = new DOMParser().parseFromString(html, "text/html");

    // See if the description can be found
    const postContent = doc.querySelector(".post-content");
    if (!postContent) {
      throw new Error("Could not find post content on page");
    }
    
    const tags = postContent.querySelectorAll("*");
    let p = "";
    for (let i = 0; i < tags.length; i++) {
      if (
        tags[i].nodeName === "IMG" &&
        tags[i].alt !== "image" &&
        tags[i].alt !== null &&
        tags[i].alt.length !== 0
      ) {
        p += `${tags[i].alt.trim()} `;
      } else if (
        tags[i].textContent !== null &&
        tags[i].textContent.length !== 0
      )
        p += `${tags[i].outerText.trim()} `;
    }

    let desc = p.split(" ");
    desc = desc.slice(0, Math.min(desc.length, 30)).join(" ");
    if (desc && desc[desc.length - 1].match(/\W/g))
      desc = desc.substr(0, desc.length - 1);
    if (desc) desc += "...";
    post.desc = `<p>${desc}</p>`;

    // Get the rest of the values as they will be found (sanitized)
    const postElement = doc.querySelector(".post");
    if (!postElement) {
      throw new Error("Could not find post element on page");
    }
    
    const postTitleElement = postElement.querySelector(".post-title");
    if (!postTitleElement) {
      throw new Error("Could not find post title on page");
    }
    
    const postTitle = postTitleElement.innerHTML;
    post.title = `<h2>${postTitle}</h2>`;
    post.link = url;
    
    const postMeta = postElement.querySelector(".post-meta");
    if (postMeta) {
      const timeElement = postMeta.querySelector("time");
      if (timeElement) {
        const postDate = timeElement.innerHTML;
        post.date = `<p>${postDate}</p>`;
      }
    }

    // Check for a thumbnail
    const bgElement = postElement.querySelector(".bg");
    if (bgElement) {
      post.img = bgElement.style.backgroundImage
        .replace('url("', "")
        .replace('")', "");
    }
    
    const thumbnailElement = postElement.querySelector(".post-thumbnail");
    if (thumbnailElement) {
      const imgElement = thumbnailElement.querySelector("img");
      if (imgElement) {
        post.img = imgElement.src;
      }
    }

    return post;
  } catch (error) {
    console.error("Error parsing HTML post:", error);
    throw error;
  }
}
