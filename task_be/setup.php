<pre>
    <?php
    system('php artisan db:wipe');
    system('php artisan migrate');
    system('php artisan db:seed');
    ?>
</pre>