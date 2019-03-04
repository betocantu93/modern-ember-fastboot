import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class IndexRoute extends Route {

  async model({username}) {
	  try {
		 return await (await fetch(`https://api.github.com/users/${username}`)).json()
	  } catch (e) {
		  return {
			  error: 'user not found'
		  }
	  }
  }
}
