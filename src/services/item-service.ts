import _ from "lodash";
import { DataItem } from "../plunet/data-item";
import { executeDelayed } from "../plunet/context";

export class ItemService {
  private dataItem;

  constructor() {
    this.dataItem = new DataItem();
  }

  async find(orderID: string) {
    const getAllItemsResponse = await executeDelayed(this.dataItem.getAllItemsByProject, {
      projectType: 3,
      projectID: orderID
    });

    const itemIDs = _.flatten([getAllItemsResponse]);
    const itemsActions = [];
    for (const itemID of itemIDs) {
      itemsActions.push(executeDelayed(this.dataItem.getItemObject, {
        projectType: 3,
        itemID: itemID
      }));
    }
    return Promise.all(itemsActions);
  }

}
