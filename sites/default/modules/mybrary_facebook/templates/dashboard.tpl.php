<?php
/**
 * dashboard.tpl.php
 */
?>
<p>Thank you for visiting the dashboard. </p>
<div><ul>
<?php foreach($friends->data as $friend): ?>
<li><?php print $friend->name; ?></li>
<?php endforeach;?>
</ul></div>