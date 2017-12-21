import { Pipe, PipeTransform } from '@angular/core';

import { User } from '../../../user/models/user';

@Pipe({name: 'ContributorIcon'})
export class ContributorIconPipe implements PipeTransform {
    transform(user: User): String {
        return user.username.charAt(0).toUpperCase();
    }
}
