import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <Html lang="en">
      <Head>
        {/* Safety failsafe:
            Next.js injects a "hide FOUC" style (body{display:none}) which should be removed by runtime JS.
            In some strict-header/dev/test environments, that removal can fail and the entire app appears blank.
            This script only activates if the body is still hidden after load, and removes the hide-fouc style. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  function unhide(){
    try{
      var s=document.querySelector('style[data-next-hide-fouc]');
      if(s && s.parentNode) s.parentNode.removeChild(s);
      if(document.body) document.body.style.display='block';
    }catch(e){}
  }
  function check(){
    try{
      if(!document.body) return;
      var d=getComputedStyle(document.body).display;
      if(d==='none') unhide();
    }catch(e){}
  }
  if(document.readyState==='complete'){
    setTimeout(check,0);
  }else{
    window.addEventListener('load', function(){ setTimeout(check,0); }, { once:true });
  }
})();`,
          }}
        />
        {plausibleDomain && (
          <script
            async
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
          />
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
