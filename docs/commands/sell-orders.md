#### [MarketBot](/MarketBot) > [commands](/MarketBot/commands) > [price](/MarketBot/commands/sell-orders)

---

## /sell-orders
##### Description
The /sell-orders command will fetch the cheapest sell orders for an item in a region. It will show the price, the location of the item and the amount of items for sale.

##### Note
The default region is The Forge and the default limit is 5. If you choose a limit higher than will fit in a single message, then the bot will only print the amount that will fit.

**This command will not show sell orders in citadels!**
##### Syntax
`/sell-orders <item-name> [/region <region-name>] [/limit <limit-number>]`

##### Aliases
* `/sell`
* `/so`
* `/s`

##### Examples
`/sell-orders vexor navy issue /region sinq laison /limit 10`
`/so skiff /region providence`
`/sell machariel /limit 7`
`/s 200mm railgun I`

##### Result
![Sell-orders command result](https://user-images.githubusercontent.com/3472373/32986152-991aa69c-cccb-11e7-8815-b2d1c4407b2a.png)