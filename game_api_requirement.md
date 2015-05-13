###Game API Requirement
**problem in bullet reduce when client emit**

item type:
- coin: add 10 scores
- blood: add 10 HP, initial HP 100, max HP 150, min 0
- bulletAdd: add 1 bullet, initial 3 bullets, max 10 bullets
- speedUp: 
- enemy: reduce 50 HP (num = 10)
- being hitted by other user: reduce 30 HP 

- client tell server he is ready
	- client to server
		- message name: "ready"
	- server reply "gameStart" message as describled later

- client position update
	- client to server
		- message name: "updatePlayer"
		- data: {positionX:i,positionY:int,direction:}
	- server to client
		- message name: "updateInformation"
		- data {counterPartyName:,positionX:,positionY:,direction:,myScore,myHP:,hisScore:,hisHP:,myBulletNum} 
	
- generate items
	- server to client
		- message name: "generateItem"
		- data: {itemType:,positionX:,positionY:,itemID:}
		- itemType: coin, blood, speedUp, bulletAdd 
	
- client trigger item (for coin,blood,bulletAdd,speedUp,enemy,destroyEnemy)
	- client to server
		- message name: "triggerItem"
		- data:{itemType:, itemID:}
	
- myBullet hit counterParty
	- client to server
		- message name: "bulletHit"
		- data:{username:}
- client died (HP < 0)
	- server to client
		- message name: "playerDied"
		- data: NA
- emitBullet 
	- client to server
		- message name: "emitBullet"
		- data:{positionX:,positionY:,velocityX:,velocityY:}
	- server to client
		- message name: "counterPartyEmit"
		- data:{postionX:,positionY:,velocityX:,velocitY:}
	
	
- game start
	- server to client
		- message name: "gameStart"
		- data: {gameMinute:(int),gameSecond:(int)}
		- // for gameStart information, server should tell client the game duration in term of x minutes and y seconds. Thus client can display a timer in game.

- game end
	- server to client
		- message name: "gameEnd"
		- data: NA

- remote iPhone controller - move
	- server to client
		- message name: "remoteMove"
		- data : {direction:('left' or 'right' or 'up' or 'down'),type:{'on' or 'off'}}

- remote iPhone controller - emit bullet
	- server to client
		- message name: "remoteEmit"
		- data: NA
