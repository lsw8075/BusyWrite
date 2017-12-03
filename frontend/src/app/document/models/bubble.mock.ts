import { Bubble, LeafBubble, InternalBubble, SuggestBubble } from './bubble';
import { Comment } from './comment';
import { Inject } from '@angular/core';

const c1: Comment = new Comment(1, '1st comment', null);
const c2: Comment = new Comment(2, '2nd comment', null);
const c3: Comment = new Comment(3, '3rd comment', null);
const c4: Comment = new Comment(4, '4th comment', null);
const c5: Comment = new Comment(5, '5th comment', null);
const c6: Comment = new Comment(6, '6th comment', null);
const c7: Comment = new Comment(7, '7th comment', null);
const c8: Comment = new Comment(8, '8th comment', null);

const sb1: SuggestBubble = new SuggestBubble(1, '1st suggest bubble', [c1, c2]);
const sb2: SuggestBubble = new SuggestBubble(2, '2nd suggest bubble', [c3]);
const sb3: SuggestBubble = new SuggestBubble(3,
'BusyWrite helps you organize new ideas. New ideas are important, but they result in lots of changes. \
Accepting new ideas is hostile, as it is unknown what revisions are needed and how many. BusyWrite shows \
users new ideas in a sidebar. It shows each idea with parts that are subject to change: lines, paragraphs \
and even other ideas!', [c5, c4]);
const sb4: SuggestBubble = new SuggestBubble(4, '4th suggest bubble', []);
const sb5: SuggestBubble = new SuggestBubble(5, 'http://busywrite.ribosome.kr', []);

    const b17: LeafBubble = new LeafBubble(17,
`<p>If you have troubles using our service check out our FAQ<a href="http://busywrite.ribosome.kr">busywrite FAQ</a></p>`);
    const b16: LeafBubble = new LeafBubble(16, 'Conclusion');
  const b15: InternalBubble = new InternalBubble(15, [b16, b17]);
      const b14: LeafBubble = new LeafBubble(14,
`<p>BusyWrite, is not just a web service, nor thousands lines of code; it is a member of your team. \
It works to accelerate your team. It links with other services to analyze your notes and create \
automatic bubbles, busy bubbles. Information relevant to your team’s work is crawled and made into \
bubbles. Busy bubbles are created from messengers like slack, from other note services like evernote, \
or from anywhere on the web. It will search google or wikipedia to grab relevant contents into bubbles \
with citation. BusyWrite will make sure the whole web is on your side.</p>`);
      const b13: LeafBubble = new LeafBubble(13, 'Body 1');
    const b12: InternalBubble = new InternalBubble(12, [b13, b14]);
      const b11: LeafBubble = new LeafBubble(11,
`<p>BusyWrite separate writing and merging. Normally, participants write on the same file, \
writing and merging simultaneously, which is troublesome. The concept of participants writing \
different parts and stacking them up to get a whole is an utopian thought; nobody is certain if \
everyone understands the same thing. On BusyWrite, instead of just writing straight to a file, \
users make bubbles. A bubble is a unit of thought that users write on. With bubbles, \
several people can write simultaneously and merge after resolving conflicts. \
Bubbles will help you cherry-pick your own version of the draft.</p>`);
      const b10: LeafBubble = new LeafBubble(10, 'Body 1');
    const b9: InternalBubble = new InternalBubble(9, [b10, b11]);
  const b8: InternalBubble = new InternalBubble(8, [b9, b12]);
    const b7: LeafBubble = new LeafBubble(7,
`<p>Limited time is the number one bottleneck of teamwork. Therefore, most of the time, \
discussion is done while writing. Teams cannot afford time to match document structure, \
details and opinions between every participant, and therefore resolve the conflicts on-the-go. \
However, this is troublesome with pre-existing services. Often, several people write the same thing. \
Often, two people realize they have different opinions after writing. Often, time is wasted unifying \
words and styles. Often, 20% of people do 80% of the work. These are all caused by not able to discuss \
properly on-the-go. That’s why we want to help teams with BusyWrite, a service to speed up team collaboration.</p>`);
    const b6: LeafBubble = new LeafBubble(6,
'<p>BusyWrite is the perfect solution for team writing. The concept of writing as a \
team has been around for a long time, by services like Google Docs, but the approaches \
are impractical and unproductive. </p>', -1, [sb2, sb4, sb1, sb3], [c7, c8]);
    const b5: LeafBubble = new LeafBubble(5, '<h5>Introduction</h5>');
  const b4: InternalBubble = new InternalBubble(4, [b5, b6, b7], [sb5], [c6]);
    const b3: LeafBubble = new LeafBubble(3, '<h3>Subtitle</h3>');
    const b2: LeafBubble = new LeafBubble(2, '<h1 class="ql-align-center">Title</h1>', 1);
  const b1: InternalBubble = new InternalBubble(1, [b2, b3]);
const rootBubble: InternalBubble = new InternalBubble(0, [b1, b4, b8, b15]);
const bubbleList: Array<Bubble> = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17];
b14.getEditLock(2);

export { rootBubble as MockBubbleRoot };
export { bubbleList as MockBubbleList };
