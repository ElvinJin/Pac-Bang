###Game API Requirement

item type:
- coin: add 10 scores
- blood: add 10 HP, initial HP 100, max HP 150, min 0
- bulletAdd: add 1 bullet, initial 3 bullets, max 10 bullets
- speedUp: 
- enemy: reduce 50 HP (num = 10)
- being hitted by other user: reduce 30 HP 

 
- client position update
	- client to server
	message name: "updatePlayer"
	data: {positionX:i,positionY:int,direction:}
	- server to client
	message name: "updateInformation"
	data:{counterPartyName:,positionX:,positionY:,direction:,myScore,myHP:,hisScore:,hisHP:,myBulletNum} 
	
- generate items
	- server to client
	message name: "generateItem"
	data: {itemType:,positionX:,positionY:,itemID:}
	
- client overlap item (for coin,blood,bulletAdd,speedUp,enemy)
	- client to server
	message name: "declareOverlap"
	data:{itemType:, itemID:}
	
- myBullet hit counterParty
	- client to server
	message name: "hitOther"
	data:{hitType:('counterParty' or 'enemy'),itemID:(userName or enemyID)}
	
- emitBullet 
	- client to server
	message name: "emitBullet"
	data:{positionX:,positionY:,velocityX:,velocityY:}
	-server to client
	message name: "counterPartyEmit"
	data:{postionX:,positionY:,velocityX:,velocitY:}
	
	
- game start
	- server to client
	message name: "gameStart"
	data: NA

- game end
	- server to client
	message name: "gameEnd"
	data: NA
