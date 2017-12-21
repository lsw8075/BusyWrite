import { ContributorIconPipe } from './contributer-icon.pipe';
import { User } from '../../../user/models/user';


describe('ContributorIconPipe', () => {
    let pipe: ContributorIconPipe;

    beforeEach(() => {
        pipe = new ContributorIconPipe();
    });

    it('transforms X to Y', () => {
        const value = new User(1, 'hi', 'hi');
        const args: string[] = [];

        expect(pipe.transform(value)).toEqual('H');
    });

});
