<?php

$req = new rXMLRPCRequest( array(
		$theSettings->getOnFinishedCommand(array("seedingtime".getUser(),getCmd('cat='))),
		$theSettings->getOnInsertCommand(array("addtime".getUser(),getCmd('cat=')))
		));
$req->run();

?>