Sequel.migration do
  up do
    alter_table(:challenge_tokens) do
       add_column :deleted_at, DateTime, :null=>true
       add_column :deleter_id, Integer, :null=>true
       add_foreign_key  [:deleter_id], :users, :key=>:id, :foreign_key_constraint_name=>'fk_challenge_token_deleter_user', :name=>'challenge_tokens_user_deleter_fkey'
    end
  end

  down do
    alter_table(:challenge_tokens) do
       drop_column :deleted_at
        drop_column :deleter_id
    end
  end
end