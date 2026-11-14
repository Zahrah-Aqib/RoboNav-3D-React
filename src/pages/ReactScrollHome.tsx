import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import storyHtml from '@/scroll/story.html?raw';
import storyCss from '@/scroll/story.css?raw';
import responsiveCss from '@/scroll/responsive.css?raw';
import setupStory from '@/scroll/story.js';

/**
 * The approved RoboNav scroll-controlled robot journey, rebuilt in React.
 *
 * This uses the SAME robot, colors, sections and 360° scroll waypoints from
 * the earlier working Streamlit/HTML concept, not the old decoration bot.
 *
 * - A ShadowRoot isolates the custom home styles from other React pages.
 * - The story moves with the real browser scroll, not a timed video.
 * - Clicking a simulator or experiment link navigates to the real pages.
 * - The entire setup and all event listeners are cleaned up on unmount.
 */
export default function ReactScrollHome() {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });

    // Preserve the reference's OWN navigation, exactly as in the approved
    // scrolling website. The ordinary React navbar is hidden on this page.
    // Keep the stage sticky within its section so it disappears naturally
    // when the visitor reaches the bottom.
    const overrides = [
      ':host{display:block;width:100%;overflow:visible!important}',
      '#rn-story-wrap{height:490vh;min-height:2800px;position:relative;overflow:visible!important}',
      '#stage{position:fixed;top:0;left:0;right:0;height:100dvh;min-height:0;inset:0 auto auto 0;width:100%}',
      '#scrollspace{display:none}',
      'nav{height:72px}',
      '.scene{inset:72px 0 40px}',
      '@media(max-width:800px){nav{height:65px}.scene{inset:65px 0 28px}}',
      '.btn,[data-target],[data-scroll]{cursor:pointer}',
      'button[data-target]{cursor:pointer}',
      '@media(max-width:800px){',
      ' #rn-story-wrap{height:430vh;min-height:2300px;overflow:visible!important}',
      ' .robot-anchor{width:205px;height:255px}',
      '}',
    ].join('\n');

    // Real site sections continue after the animated story. These contain
    // visible page links, so mobile visitors never end at a blank screen.
    const nextSections = `
      <section id="robonav-next" aria-label="Explore RoboNav features">
        <div class="next-inner">
          <div class="eyebrow">The journey continues</div>
          <h2>Now put RoboNav <b>to the test.</b></h2>
          <p>Design an obstacle map, watch A* and Greedy search every cell,
             and compare real Python results. The robot animation is the introduction;
             the tools below are the actual project.</p>
          <div class="next-grid">
            <button class="next-card" data-target="Simulator"><span>01 / SIMULATE</span><strong>Grid Simulator</strong><small>Choose start, goal and walls. Replay the path and frontier.</small><em>Launch →</em></button>
            <button class="next-card" data-target="Algorithm Comparison"><span>02 / COMPARE</span><strong>A* vs Greedy</strong><small>See two real search algorithms navigate the same grid.</small><em>Compare →</em></button>
            <button class="next-card" data-target="Experiments"><span>03 / EXPERIMENT</span><strong>Experiment Lab</strong><small>Explore measured path cost, nodes expanded and execution times.</small><em>Explore →</em></button>
          </div>
          <button class="next-primary" data-target="Simulator">Start navigating with RoboNav ↗</button>
        </div>
      </section>`;
    const nextStyles = `
      #robonav-next{min-height:100svh;position:relative;z-index:1;background:linear-gradient(150deg,#03111e,#071d31 65%,#020915);color:#edfaff;padding:clamp(55px,8vw,115px) 6vw;font-family:Inter,system-ui,sans-serif}
      .next-inner{max-width:1150px;margin:0 auto}
      #robonav-next h2{font-size:clamp(38px,6vw,76px);line-height:1.06;letter-spacing:-.055em;margin:12px 0 25px;font-weight:850}
      #robonav-next h2 b{color:#43f1f4}
      #robonav-next p{font-size:clamp(15px,1.5vw,19px);line-height:1.7;color:#a8c7d8;max-width:730px}
      .next-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:50px 0 35px}
      .next-card{display:flex;flex-direction:column;gap:18px;min-height:245px;border:1px solid #37cbdd55;border-radius:18px;padding:27px;background:linear-gradient(135deg,#0e2a43,#071728);color:#eafaff;text-align:left;cursor:pointer;font:inherit;transition:transform .2s,border .2s}
      .next-card:hover{border-color:#4ffaff;transform:translateY(-5px)}
      .next-card span{font-size:11px;letter-spacing:2px;color:#50ebf1;font-weight:750}
      .next-card strong{font-size:clamp(20px,2vw,26px);letter-spacing:-.03em}
      .next-card small{font-size:14px;color:#a4bfd0;line-height:1.6}
      .next-card em{font-size:14px;color:#4feef7;font-weight:800;font-style:normal;margin-top:auto}
      .next-primary{border:0;border-radius:12px;background:#43f1f4;color:#03222a;padding:17px 24px;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 0 25px #18f6f044}
      @media(max-width:760px){#robonav-next{padding:62px 22px}.next-grid{grid-template-columns:1fr;gap:14px;margin:35px 0}.next-card{min-height:170px;padding:21px;gap:10px}}
    `;

    // CSS order is important: responsive rules override the original fixed scene sizes.
    shadow.innerHTML = '<style>' + storyCss + overrides + nextStyles + responsiveCss + '</style>' + storyHtml + nextSections;

    const cleanup = setupStory(shadow, navigate);
    return () => {
      cleanup();
      shadow.replaceChildren();
    };
  }, [navigate]);

  return <div ref={mountRef} aria-label="RoboNav interactive scroll-controlled robot with 360 degree spin" />;
}
