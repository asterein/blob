const CLASSES = {
  MAIN: "blob-pagination",
  ACTIVE_PAGE: "active-blob-page",
  PAGE_JUMP: 'blob-page-jump',
  JUMP_START: 'blob-page-start',
  JUMP_END: 'blob-page-end',
  OVERFLOW_TARGET: 'blob-page-overflow',
  OVERFLOW_HIDE: 'blob-page-overflow__hidden'
}

async function getBlobs () {
  const blobs = await fetch("./blobs/index.json")
    .then(r => r.text())
    .then(t => JSON.parse(t));
  return blobs.filter(b => b.length > 0).reverse();
}

async function blobPagination (blobsPerPage) {
  const blobs = await getBlobs();
  return Math.ceil(blobs.length/blobsPerPage);
}

async function generateBlobPagination (parentID, blobsPerPage, onClickFunction) {
  const numOfPages = await blobPagination(blobsPerPage);
  //if (numOfPages <= 1) return;
  const parent = document.querySelector(parentID);

  function createBtn (label, page) {
    let btn = document.createElement("button");
    btn.innerText = label;
    btn.classList.add(CLASSES.MAIN);
    btn.setAttribute('onclick', `${onClickFunction}(${blobsPerPage}, ${page}, this)`);
    if (numOfPages > 5) btn.setAttribute('overflow', true);
    return btn;
  }

  if (numOfPages > 5) {
    let btn = createBtn("«",1);
    btn.classList.add(CLASSES.PAGE_JUMP);
    btn.classList.add(CLASSES.JUMP_START);
    parent.appendChild(btn);
  }

  for (let i = 1; i <= numOfPages; i++) {
    let btn = createBtn(i,i);
    btn.setAttribute('page', i);
    if (i === 1) {
      btn.classList.add(CLASSES.ACTIVE_PAGE);
      btn.setAttribute("first", true);
      btn.style['pointer-events'] = "none";
    }
    if (numOfPages > 5 && i > 3) {
      if (i === 4) {
        btn.classList.add(CLASSES.OVERFLOW_TARGET);
        btn.innerText = "..."
      } else {
        btn.classList.add(CLASSES.OVERFLOW_HIDE);
      }
    }
    if (i === numOfPages) {
      btn.setAttribute("last", true);
    }
    parent.appendChild(btn);
  }

  if (numOfPages > 5) {
    let btn = createBtn("»",numOfPages);
    btn.classList.add(CLASSES.PAGE_JUMP);
    btn.classList.add(CLASSES.JUMP_END);
    parent.appendChild(btn);
  }
}

async function generateBlobStream (parentID, blobsPerPage, currentPage) {
  const blobs = await getBlobs();
  const parent = document.querySelector(parentID);
  parent.innerHTML = "";
  const start = (currentPage - 1) * blobsPerPage;
  const end = blobsPerPage + start;
  blobs.slice(start,end).forEach(async (blob) => {
    if (!blob) return;

    async function getBlob (blobFile) {
      const blob = await fetch(`./blobs/${blobFile}`)
        .then(r => r.text());
      return blob;
    }
    let text = await getBlob(blob);
    let card = document.createElement("blob-card");
    card.setAttribute('blob', text);
    card.setAttribute('index', blobs.length-blobs.indexOf(blob)-1);
    card.setAttribute('name', blob);
    parent.appendChild(card);
  })
}

function handleBlobPageClick (bpp, page, element) {
  generateBlobStream("#blobs", bpp, page);

  // Remove active class
  let btns = document.querySelectorAll(`.${CLASSES.ACTIVE_PAGE}`);
  btns.forEach(btn => {
    btn.classList.remove(CLASSES.ACTIVE_PAGE);
    btn.style['pointer-events'] = "auto";
  });

  // Reassign active class
  if (!element.classList.value.includes(CLASSES.PAGE_JUMP)) {
    element.classList.add(CLASSES.ACTIVE_PAGE);
    element.style['pointer-events'] = "none";
  } else {
    if (element.classList.value.includes(CLASSES.JUMP_START)) {
      let btn = document.querySelector("[first]");
      btn.classList.add(CLASSES.ACTIVE_PAGE);
      btn.style['pointer-events'] = "none";
    } else {
      let btn = document.querySelector("[last]");
      btn.classList.add(CLASSES.ACTIVE_PAGE);
      btn.style['pointer-events'] = "none";
    } 
  }

  // Handle pagination if more than 5 pages
  if (element.getAttribute('overflow')) {
    let btns = document.querySelectorAll(`.${CLASSES.MAIN}`);
    let lastPage = Number(document.querySelector("[last]").getAttribute('page'));

    // Determine which pages should be visible
    let visiblePages = [page-2, page-1, page, page+1, page+2];
    let startMargin = [1, 2];
    let endMargin = [lastPage, lastPage-1];
    if (startMargin.includes(page)) {
      visiblePages = [1, 2, 3, 4];
    }
    if (endMargin.includes(page)) {
      visiblePages = [lastPage-3, lastPage-2, lastPage-1, lastPage];
    }

    btns.forEach(btn => {
      let btnPage = Number(btn.getAttribute('page'));

      // Apply overflow hide class where needed
      if (visiblePages.includes(btnPage) || btn.classList.value.includes(CLASSES.PAGE_JUMP)) {
        if (btn.classList.value.includes(CLASSES.OVERFLOW_HIDE)) {
          btn.classList.remove(CLASSES.OVERFLOW_HIDE);
        }
      } else {
        btn.classList.add(CLASSES.OVERFLOW_HIDE);
      }
      
      // Set all buttons inner text to their representative page
      if (!btn.classList.value.includes(CLASSES.PAGE_JUMP)) {
        btn.innerText = btnPage.toString();
      }

      // Set ... to buttons where applicable
      if (startMargin.includes(page)) {
        if (btnPage === visiblePages[visiblePages.length-1]) {
          btn.innerText = "...";
        }
      } else if (endMargin.includes(page)) {
        if (btnPage === visiblePages[0]) {
          btn.innerText = "...";
        }
      } else {
        if ([visiblePages[0],visiblePages[visiblePages.length-1]].includes(btnPage)) {
          btn.innerText = "...";
        }
      }
    });
  }
}

function blobInit (blobTimeline, blobPagination, blobsPerPage) {
  /* blobTimeline         :String  => ID of blob timeline element
   * blobPagination       :String  => ID of blob pagination element
   * blobsPerPage         :Int     => how many blobs to display per page
   */

  generateBlobStream(blobTimeline, blobsPerPage, 1);
  generateBlobPagination(blobPagination, blobsPerPage, 'handleBlobPageClick');
}

