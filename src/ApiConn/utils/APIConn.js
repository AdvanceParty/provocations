import ServerlessFuncs from './ServerlessFuncs';
import Query from './Query';
import { TABLES } from '../../config';
import { MESSAGES } from '../../strings';

const serverlessFuncs = new ServerlessFuncs();

export default class APIConn {
  constructor({ useMockdata = false } = {}) {
    this.isLoading = false;
    this.useMockData = useMockdata;
  }

  isOnline = () => {
    return navigator.onLine;
  };

  set useMockData(bool) {
    this._useMockData = bool;
    if (bool) {
      console.log(MESSAGES.USING_MOCK_DATA);
    }
  }

  get useMockData() {
    return this._useMockData;
  }

  fetchContentIndex() {
    serverlessFuncs.useMock = this.useMockData;

    return new Promise(async (resolve, reject) => {
      if (this.isLoading) reject(MESSAGES.NO_CONCURRENT_FETCH);

      this.isLoading = true;
      const { NAME, FIELDS } = TABLES.SPARK;
      const method = `/${NAME}`;
      const params = {
        fields: [FIELDS.ID],
        filterByFormula: `{${FIELDS.IS_PUBLISHED}}`
      };

      try {
        const result = await serverlessFuncs.sendQuery(
          new Query(method, params)
        );
        resolve(result);
      } catch (e) {
        console.error('INDEX could not be fetched via serverless functions:');
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    });
  }

  /**
   * Fetches a content item via API. Can fetch a specific item using the
   * itemId argument or, if no itemId argument is supplied, a random item will be fetched.
   * @param {str} itemId
   */
  fetchItem({ itemId }) {
    serverlessFuncs.useMock = this.useMockData;

    return new Promise(async (resolve, reject) => {
      if (this.isLoading) reject(MESSAGES.NO_CONCURRENT_FETCH);

      this.isLoading = true;

      const { NAME, FIELDS } = TABLES.SPARK;
      const { TITLE, CONTENT, TAGS, ACTIONS } = FIELDS;

      const method = `/${NAME}`;
      const params = {
        fields: [TITLE, CONTENT, TAGS, ACTIONS],
        filterByFormula: `{rec_id}="${itemId}"`
      };

      try {
        const records = await serverlessFuncs.sendQuery(
          new Query(method, params)
        );
        resolve(records[0]);
      } catch (e) {
        console.error('ITEM could not be fetched via serverless functions:');
        console.error(e);
        reject(e);
      } finally {
        this.isLoading = false;
      }
    });
  }
}
