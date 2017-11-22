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
const sb3: SuggestBubble = new SuggestBubble(3, 'BusyWrite helps you organize new ideas. New ideas are important, but they result in lots of changes. Accepting new ideas is hostile, as it is unknown what revisions are needed and how many. BusyWrite shows users new ideas in a sidebar. It shows each idea with parts that are subject to change: lines, paragraphs and even other ideas!', [c5, c4]);
const sb4: SuggestBubble = new SuggestBubble(4, '4th suggest bubble', []);

  const b15: LeafBubble = new LeafBubble(15, '<i>we are team !</i>');
      const b10: LeafBubble = new LeafBubble(10,
`Limited time is the number one bottleneck of teamwork. Therefore, \
most of the time, discussion is done while writing. Teams cannot afford \
time to match document structure, details and opinions between every \
participant, and therefore resolve the conflicts  on-the-go.`);
      const b9: LeafBubble = new LeafBubble(9,
`BusyWrite separate writing and merging. Normally, participants \
write on the same file, writing and merging simultaneously, which \
is troublesome. The concept of participants writing different parts \
and stacking them up to get a whole is an utopian thought; nobody is \
certain if everyone understands the same thing. On BusyWrite, instead \
of just writing straight to a file, users make bubbles`);
        const b11: LeafBubble = new LeafBubble(11,
`BusyWrite is the perfect solution for team writing. \
The concept of writing as a team has been around for a long time, \
by services like Google Docs, but the approaches are impractical and unproductive.`, -1, [sb2, sb4, sb1, sb3]);
            const b19: LeafBubble = new LeafBubble(19, `<strong>hey!</strong>`);
            const b18: LeafBubble = new LeafBubble(18,
`BusyWrite helps you organize new ideas. New ideas are important, \
but they result in lots of changes. Accepting new ideas is hostile, \
as it is unknown what revisions are needed and how many. BusyWrite \
shows users new ideas in a sidebar. It shows each idea with parts \
that are subject to change: lines, paragraphs and even other ideas!`);
            const b17: LeafBubble = new LeafBubble(17, `<a href="http://busywrite.ribosome.kr">BusyWrite</a>`);
          const b16: InternalBubble = new InternalBubble(16, [b17, b18, b19]);
          const b14: LeafBubble = new LeafBubble(14, 'handle short sentences');
          const b13: LeafBubble = new LeafBubble(13, `hello swpp team 1`);
        const b12: InternalBubble = new InternalBubble(12, [b13, b14, b16]);
      const b8: InternalBubble = new InternalBubble(8, [b11, b12]);
    const b7: InternalBubble = new InternalBubble(7, [b8, b9, b10]);
    const b2: LeafBubble = new LeafBubble(2,
`<h1>Sed ut perspiciatis</h1>, unde omnis iste natus error sit \
voluptatem accusantium doloremque laudantium, totam rem aperiam \
eaque ipsa, quae ab illo inventore veritatis et quasi architecto \
beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia \
voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur \
magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui do`);
      const b5: LeafBubble = new LeafBubble(5,
`lorem ipsum, quia dolor sit amet consectetur adipisci velit, sed quia non numquam \
eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. \
Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, \
nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, \
qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, \
qui dolorem eum fugiat, quo voluptas nulla pariatur?`);
      const b6: LeafBubble = new LeafBubble(6,
`At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium \
voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, \
obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt \
mollitia animi, id est laborum`);
    const b3: InternalBubble = new InternalBubble(3, [b5, b6]);
    const b4: LeafBubble = new LeafBubble(4,
`et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. \
Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, \
quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, \
omnis dolor repellendus.`);
  const b1: InternalBubble = new InternalBubble(1, [b7, b2, b3, b4]);
const rootBubble: InternalBubble = new InternalBubble(0, [b1, b15]);
const bubbleList: Array<Bubble> = [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19];
b5.getEditLock(2);

export { rootBubble as MockBubbleRoot };
export { bubbleList as MockBubbleList };
