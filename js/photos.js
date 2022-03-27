(function(html) {
const id = document.currentScript.getAttribute('data-photo-id');
const url = document.currentScript.getAttribute('data-photo-url');
const target = document.currentScript.getAttribute('data-target-id');
const container = document.querySelector(`#${target}`);
container.innerHTML = html;
openPhoto("id-"+id, url);
lazyload();
})(`
<li class="item " id="id-dsc-1030" style="background-image: url('/photos/tint/DSC_1030-65ba1d.jpg')" title="DSC_1030">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_1030-ccf4df.jpg" src="/photos/tint/DSC_1030-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_1030-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-1030" data-target="id-dsc-1030">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-1002" data-target="id-dsc-1002" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-1002" style="background-image: url('/photos/tint/DSC_1002-65ba1d.jpg')" title="DSC_1002">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_1002-ccf4df.jpg" src="/photos/tint/DSC_1002-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_1002-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-1002" data-target="id-dsc-1002">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-1030" data-target="id-dsc-1030" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0716" data-target="id-dsc-0716" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0716" style="background-image: url('/photos/tint/DSC_0716-65ba1d.jpg')" title="DSC_0716">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0716-ccf4df.jpg" src="/photos/tint/DSC_0716-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0716-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0716" data-target="id-dsc-0716">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-1002" data-target="id-dsc-1002" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0697" data-target="id-dsc-0697" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0697" style="background-image: url('/photos/tint/DSC_0697-65ba1d.jpg')" title="DSC_0697">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0697-ccf4df.jpg" src="/photos/tint/DSC_0697-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0697-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0697" data-target="id-dsc-0697">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0716" data-target="id-dsc-0716" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0692" data-target="id-dsc-0692" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0692" style="background-image: url('/photos/tint/DSC_0692-65ba1d.jpg')" title="DSC_0692">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0692-ccf4df.jpg" src="/photos/tint/DSC_0692-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0692-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0692" data-target="id-dsc-0692">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0697" data-target="id-dsc-0697" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0651" data-target="id-dsc-0651" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/3200</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0651" style="background-image: url('/photos/tint/DSC_0651-65ba1d.jpg')" title="DSC_0651">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0651-ccf4df.jpg" src="/photos/tint/DSC_0651-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0651-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0651" data-target="id-dsc-0651">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0692" data-target="id-dsc-0692" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0596" data-target="id-dsc-0596" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0596" style="background-image: url('/photos/tint/DSC_0596-65ba1d.jpg')" title="DSC_0596">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0596-ccf4df.jpg" src="/photos/tint/DSC_0596-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0596-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0596" data-target="id-dsc-0596">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0651" data-target="id-dsc-0651" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0574" data-target="id-dsc-0574" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0574" style="background-image: url('/photos/tint/DSC_0574-65ba1d.jpg')" title="DSC_0574">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0574-ccf4df.jpg" src="/photos/tint/DSC_0574-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0574-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0574" data-target="id-dsc-0574">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0596" data-target="id-dsc-0596" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0471" data-target="id-dsc-0471" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/3200</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0471" style="background-image: url('/photos/tint/DSC_0471-65ba1d.jpg')" title="DSC_0471">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0471-ccf4df.jpg" src="/photos/tint/DSC_0471-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0471-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0471" data-target="id-dsc-0471">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0574" data-target="id-dsc-0574" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/dsc-0429" data-target="id-dsc-0429" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/3200</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-dsc-0429" style="background-image: url('/photos/tint/DSC_0429-65ba1d.jpg')" title="DSC_0429">
  <img class="lazyload" data-src="/photos/thumbnail/DSC_0429-ccf4df.jpg" src="/photos/tint/DSC_0429-65ba1d.jpg" height="4000" width="6000" />
  <span class="full">
    <span style="background-image: url('/photos/large/DSC_0429-686656.jpg')"></span>
  </span>
  <a class="open" href="/dsc-0429" data-target="id-dsc-0429">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0471" data-target="id-dsc-0471" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <a href="/hoopes" data-target="id-hoopes" class="next" title="Go to next photo">
    <span>Next</span>
  </a>
  <!-- <ul class="meta">
    <li>NIKON D3300</li>
    <li>1/4000</li>
    <li><span class="aperture"><em>f</em>/</span>1.8</li>
    </ul> -->
</li>
<li class="item " id="id-hoopes" style="background-image: url('/photos/tint/hoopes-65ba1d.jpg')" title="hoopes">
  <img class="lazyload" data-src="/photos/thumbnail/hoopes-ccf4df.jpg" src="/photos/tint/hoopes-65ba1d.jpg" height="1366" width="1024" />
  <span class="full">
    <span style="background-image: url('/photos/large/hoopes-686656.jpg')"></span>
  </span>
  <a class="open" href="/hoopes" data-target="id-hoopes">Open</a>
  <a class="close" href="/">Close</a>
  <a href="/dsc-0429" data-target="id-dsc-0429" class="previous" title="Go to previous photo">
    <span>Previous</span>
  </a>
  <!-- <ul class="meta">
    <li>iPhone 12 Pro Max</li>
    <li>1/60</li>
    <li><span class="aperture"><em>f</em>/</span>2.2</li>
    </ul> -->
</li>
`);