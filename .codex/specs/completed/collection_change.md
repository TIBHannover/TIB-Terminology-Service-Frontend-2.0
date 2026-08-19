Task:
- enhance collection page and collection list


Details:
- On the collection list:
  - on small screens the collection logo moves with scrolling and goes over the text. this is good in big screens where logo is side by side with text. but for small screens creates issue because collection is above the text.
  - stop the scrolling effect on small screens.
- on the collection page:
    - at the moment if the api returns no collection, the page raises Not Found error component.
    - this is fine when a collection is not really there.
    - but when a collection exists in `collectionsText.json` but not in the api yet, the not found is not correct.
    - instead for this particular case, the collection page must show something like "Soon available" or "Coming soon" or something similar.


