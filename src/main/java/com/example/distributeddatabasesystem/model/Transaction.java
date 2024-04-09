package com.example.distributeddatabasesystem.model;

public class Transaction {
    private String node;
    private String isolationLevel;
    private String transaction;
    private String operation;
    private String commitOrRollback;

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }
    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getIsolationLevel() {
        return isolationLevel;
    }

    public void setIsolationLevel(String isolationLevel) {
        this.isolationLevel = isolationLevel;
    }

    public String getTransaction() {
        return transaction;
    }

    public void setTransaction(String transaction) {
        this.transaction = transaction;
    }

    public String getCommitOrRollback() {
        return commitOrRollback;
    }

    public void setCommitOrRollback(String commitOrRollback) {
        this.commitOrRollback = commitOrRollback;
    }

    public Transaction(String node, String isolationLevel, String transaction, String operation, String commitOrRollback) {
        this.node = node;
        this.isolationLevel = isolationLevel;
        this.transaction = transaction;
        this.operation = operation;
        this.commitOrRollback = commitOrRollback;
    }
}